import express from "express";
import cors from "cors";
import * as jose from "jose";
import { config } from "./config.js";
import { getEurToUsdtRate, applySpread, roundUsdt } from "./rates.js";
import { supabaseAdmin } from "./supabase.js";

const app = express();
app.use(cors());
app.use(express.json());
// Handle CORS preflight cleanly
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Allow routes to work both with and without the "/api" prefix (Vercel catch-all)
app.use((req, _res, next) => {
  if (!req.url.startsWith('/api/')) {
    req.url = req.url.startsWith('/') ? `/api${req.url}` : `/api/${req.url}`;
  }
  next();
});

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "dev_admin_token";

type StoredQuoteStatus = "pending" | "submitted" | "confirmed" | "expired";

// Middleware d'authentification (Supabase JWT via JWKS)
const authenticateToken = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Access token required" });

    const RAW_URL = process.env.SUPABASE_URL || "https://rhigaegceftzmyxivfph.supabase.co";
    const BASE_URL = RAW_URL.replace(/\/+$/, ""); // trim trailing slashes
    const JWKS_URL = `${BASE_URL}/auth/v1/keys`;
    console.log('JWT Verification Debug:', { JWKS_URL, token: token.substring(0, 20) + '...' });
    
    // Test JWKS endpoint accessibility
    try {
      const jwksResponse = await fetch(JWKS_URL);
      console.log('JWKS Response:', { status: jwksResponse.status, statusText: jwksResponse.statusText });
      if (!jwksResponse.ok) {
        throw new Error(`JWKS endpoint returned ${jwksResponse.status}: ${jwksResponse.statusText}`);
      }
    } catch (jwksError) {
      console.error('JWKS fetch error:', jwksError);
      // Fallback: verify JWT locally without JWKS (less secure but works)
      console.log('Falling back to local JWT verification');
      try {
        const { payload } = await jose.jwtVerify(token, { algorithms: ['HS256'] });
        console.log('Local JWT verification successful');
        req.user = { userId: payload.sub, email: payload.email };
        return next();
      } catch (localError) {
        console.error('Local JWT verification failed:', localError);
        return res.status(403).json({ error: "Invalid token" });
      }
    }
    
    const jwks = jose.createRemoteJWKSet(new URL(JWKS_URL));
    const { payload } = await jose.jwtVerify(token, jwks);
    // Optional sanity: ensure token issuer matches project URL
    const iss = String((payload as any).iss || "");
    const expectedIss = `${BASE_URL}/auth/v1`;
    if (!iss.startsWith(expectedIss)) {
      return res.status(403).json({ error: "Invalid token issuer" });
    }
    console.log('JWT Verification Success:', { userId: payload.sub, email: payload.email });

    // payload.sub is the user id in Supabase
    req.user = { userId: payload.sub, email: payload.email };
    return next();
  } catch (err) {
    console.error('JWT Verification Error:', err);
    return res.status(403).json({ error: "Invalid token" });
  }
};

// ===== AUTHENTICATION ENDPOINTS (managed by Supabase) =====

// Get user profile (from public.profiles)
app.get("/api/auth/profile", authenticateToken, async (req: any, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id,email,first_name,last_name,phone,address,city,country,created_at')
      .eq('id', req.user.userId)
      .single();
    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      phone: data.phone,
      address: data.address,
      city: data.city,
      country: data.country,
      createdAt: data.created_at
    };

    res.json({ user });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Simple auth check
app.get("/api/auth/whoami", authenticateToken, (req: any, res) => {
  res.json({ user: req.user });
});
// Mirror without /api prefix (for serverless path forwarding)
app.get("/auth/profile", authenticateToken, async (req: any, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id,email,first_name,last_name,phone,address,city,country,created_at')
      .eq('id', (req as any).user.userId)
      .single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: "User not found" });
    const user = {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      phone: data.phone,
      address: data.address,
      city: data.city,
      country: data.country,
      createdAt: data.created_at
    };
    res.json({ user });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update user profile (public.profiles)
app.put("/api/auth/profile", authenticateToken, async (req: any, res) => {
  try {
    const { firstName, lastName, phone, address, city, country } = req.body;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone,
        address,
        city,
        country
      })
      .eq('id', req.user.userId)
      .select('id,email,first_name,last_name,phone,address,city,country')
      .single();
    if (error) throw error;

    const user = {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      phone: data.phone,
      address: data.address,
      city: data.city,
      country: data.country
    };

    res.json({ user });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.put("/auth/profile", authenticateToken, async (req: any, res) => {
  try {
    const { firstName, lastName, phone, address, city, country } = req.body;
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ first_name: firstName, last_name: lastName, phone, address, city, country })
      .eq('id', (req as any).user.userId)
      .select('id,email,first_name,last_name,phone,address,city,country')
      .single();
    if (error) throw error;
    const user = {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      phone: data.phone,
      address: data.address,
      city: data.city,
      country: data.country
    };
    res.json({ user });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== PAYMENT ENDPOINTS (avec gestion des utilisateurs) =====

// Create payment quote
app.post("/api/payment/quote", authenticateToken, async (req: any, res) => {
  try {
    const { currency, amount, network } = req.body || {};
    if (!currency || typeof amount !== "number" || !network) {
      return res.status(400).json({ error: "invalid_body" });
    }

    // Get real-time EUR->USDT rate, apply spread and rounding
    const { rate, provider } = await getEurToUsdtRate();
    const ttlMs = (config.quotes.ttlSeconds ?? 900) * 1000;
    const expiresAt = new Date(Date.now() + ttlMs);
    const baseUsdt = amount * rate; // EUR * (USDT per EUR)
    const withSpread = applySpread(baseUsdt, config.quotes.spreadBps ?? 30);
    const amountUSDT = roundUsdt(withSpread); // string for UI; store as numeric in DB
    const quoteId = Math.random().toString(36).slice(2, 10);
    
    // Address per network from env (fallback to mock for dev)
    const addressByNet: Record<string, string> = {
      "TRC-20": process.env.WALLET_TRC20 || "TXMockTronAddr9999999999999999999999",
      "ERC-20": process.env.WALLET_ERC20 || "0xMockEthereumAddress0000000000000000",
      "BEP-20": process.env.WALLET_BEP20 || "0xMockBscAddress00000000000000000000",
    };
    const address = addressByNet[network] || addressByNet["TRC-20"];

    // Créer la quote avec l'utilisateur (public.quotes)
    const { error: qErr } = await supabaseAdmin
      .from('quotes')
      .insert({
        quote_id: quoteId,
        user_id: req.user.userId,
        amount_usdt: Number(amountUSDT),
        network,
        address,
        expires_at: expiresAt.toISOString(),
        status: 'pending',
        fiat_currency: String(currency).toUpperCase(),
        fiat_amount: Number(amount.toFixed(2)),
        rate: Number(rate),
        rate_provider: provider,
        rate_at: new Date().toISOString()
      });
    if (qErr) throw qErr;

    // Créer le Payment associé (manuel)
    const { error: pErr } = await supabaseAdmin
      .from('payments')
      .insert({
        quote_id: quoteId,
        user_id: req.user.userId,
        network,
        address,
        expected_amount: Number(amountUSDT),
        status: 'pending',
        provider: 'manual'
      });
    if (pErr) throw pErr;

    res.json({ 
      quoteId, 
      amountUSDT, 
      network, 
      address, 
      expiresAt: expiresAt.toISOString(),
      rate,
      rateProvider: provider,
      fiatCurrency: String(currency).toUpperCase(),
      fiatAmount: Number(amount.toFixed(2))
    });
  } catch (error) {
    console.error("Quote creation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Mirror without /api prefix
app.post("/payment/quote", authenticateToken, async (req: any, res) => {
  try {
    const { currency, amount, network } = req.body || {};
    if (!currency || typeof amount !== "number" || !network) {
      return res.status(400).json({ error: "invalid_body" });
    }
    const { rate, provider } = await getEurToUsdtRate();
    const ttlMs = (config.quotes.ttlSeconds ?? 900) * 1000;
    const expiresAt = new Date(Date.now() + ttlMs);
    const baseUsdt = amount * rate;
    const withSpread = applySpread(baseUsdt, config.quotes.spreadBps ?? 30);
    const amountUSDT = roundUsdt(withSpread);
    const quoteId = Math.random().toString(36).slice(2, 10);
    const addressByNet: Record<string, string> = {
      "TRC-20": process.env.WALLET_TRC20 || "TXMockTronAddr9999999999999999999999",
      "ERC-20": process.env.WALLET_ERC20 || "0xMockEthereumAddress0000000000000000",
      "BEP-20": process.env.WALLET_BEP20 || "0xMockBscAddress00000000000000000000",
    };
    const address = addressByNet[network] || addressByNet["TRC-20"];
    const { error: qErr } = await supabaseAdmin
      .from('quotes')
      .insert({
        quote_id: quoteId,
        user_id: (req as any).user.userId,
        amount_usdt: Number(amountUSDT),
        network,
        address,
        expires_at: expiresAt.toISOString(),
        status: 'pending',
        fiat_currency: String(currency).toUpperCase(),
        fiat_amount: Number(amount.toFixed(2)),
        rate: Number(rate),
        rate_provider: provider,
        rate_at: new Date().toISOString()
      });
    if (qErr) throw qErr;
    const { error: pErr } = await supabaseAdmin
      .from('payments')
      .insert({
        quote_id: quoteId,
        user_id: (req as any).user.userId,
        network,
        address,
        expected_amount: Number(amountUSDT),
        status: 'pending',
        provider: 'manual'
      });
    if (pErr) throw pErr;
    res.json({ 
      quoteId,
      amountUSDT,
      network,
      address,
      expiresAt: expiresAt.toISOString(),
      rate,
      rateProvider: provider,
      fiatCurrency: String(currency).toUpperCase(),
      fiatAmount: Number(amount.toFixed(2))
    });
  } catch (error) {
    console.error("Quote creation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get payment status
app.get("/api/payment/status/:quoteId", authenticateToken, async (req: any, res) => {
  try {
    const { quoteId } = req.params;
    
    const { data: quote, error } = await supabaseAdmin
      .from('quotes')
      .select('*')
      .eq('quote_id', quoteId)
      .eq('user_id', req.user.userId)
      .single();
    if (error) throw error;

    if (!quote) return res.status(404).json({ error: "not_found" });

    const now = new Date();
    if (now >= new Date(quote.expires_at)) {
      const { error: uErr } = await supabaseAdmin
        .from('quotes')
        .update({ status: 'expired' })
        .eq('quote_id', quoteId);
      if (uErr) throw uErr;
      return res.json({ status: "expired" });
    }

    if (quote.status === "submitted") {
      return res.json({ status: quote.status, txHash: quote.tx_hash });
    }
    if (quote.status === "confirmed") {
      return res.json({ status: quote.status, confirmations: 1, txHash: quote.tx_hash });
    }
    
    return res.json({ status: quote.status });
  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/payment/status/:quoteId", authenticateToken, async (req: any, res) => {
  try {
    const { quoteId } = req.params;
    const { data: quote, error } = await supabaseAdmin
      .from('quotes')
      .select('*')
      .eq('quote_id', quoteId)
      .eq('user_id', (req as any).user.userId)
      .single();
    if (error) throw error;
    if (!quote) return res.status(404).json({ error: "not_found" });
    const now = new Date();
    if (now >= new Date(quote.expires_at)) {
      const { error: uErr } = await supabaseAdmin
        .from('quotes')
        .update({ status: 'expired' })
        .eq('quote_id', quoteId);
      if (uErr) throw uErr;
      return res.json({ status: "expired" });
    }
    if (quote.status === "submitted") {
      return res.json({ status: quote.status, txHash: quote.tx_hash });
    }
    if (quote.status === "confirmed") {
      return res.json({ status: quote.status, confirmations: 1, txHash: quote.tx_hash });
    }
    return res.json({ status: quote.status });
  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Submit transaction hash
app.post("/api/payment/submit-tx", authenticateToken, async (req: any, res) => {
  try {
    const { quoteId, txHash } = req.body || {};
    if (!quoteId || !txHash || typeof txHash !== "string") {
      return res.status(400).json({ error: "invalid_body" });
    }

    const { data: quote, error } = await supabaseAdmin
      .from('quotes')
      .select('*')
      .eq('quote_id', quoteId)
      .eq('user_id', req.user.userId)
      .single();
    if (error) throw error;

    if (!quote) return res.status(404).json({ error: "quote_not_found" });

    const now = new Date();
    if (now >= new Date(quote.expires_at)) return res.status(400).json({ error: "expired" });

    const { error: uq } = await supabaseAdmin
      .from('quotes')
      .update({ tx_hash: txHash, status: 'submitted' })
      .eq('quote_id', quoteId);
    if (uq) throw uq;
    const { error: up } = await supabaseAdmin
      .from('payments')
      .update({ tx_hash: txHash, status: 'submitted' })
      .eq('quote_id', quoteId);
    if (up) throw up;

    return res.json({ ok: true, status: "submitted", txHash });
  } catch (error) {
    console.error("Submit tx error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/payment/submit-tx", authenticateToken, async (req: any, res) => {
  try {
    const { quoteId, txHash } = req.body || {};
    if (!quoteId || !txHash || typeof txHash !== "string") {
      return res.status(400).json({ error: "invalid_body" });
    }
    const { data: quote, error } = await supabaseAdmin
      .from('quotes')
      .select('*')
      .eq('quote_id', quoteId)
      .eq('user_id', (req as any).user.userId)
      .single();
    if (error) throw error;
    if (!quote) return res.status(404).json({ error: "quote_not_found" });
    const now = new Date();
    if (now >= new Date(quote.expires_at)) return res.status(400).json({ error: "expired" });
    const { error: uq } = await supabaseAdmin
      .from('quotes')
      .update({ tx_hash: txHash, status: 'submitted' })
      .eq('quote_id', quoteId);
    if (uq) throw uq;
    const { error: up } = await supabaseAdmin
      .from('payments')
      .update({ tx_hash: txHash, status: 'submitted' })
      .eq('quote_id', quoteId);
    if (up) throw up;
    return res.json({ ok: true, status: "submitted", txHash });
  } catch (error) {
    console.error("Submit tx error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin confirmation endpoint
app.post("/api/payment/admin/confirm", async (req, res) => {
  try {
    const { token, quoteId } = req.body || {};
    if (!token || token !== ADMIN_TOKEN) return res.status(401).json({ error: "unauthorized" });
    if (!quoteId) return res.status(400).json({ error: "invalid_body" });

    const { data: quote, error } = await supabaseAdmin
      .from('quotes')
      .select('*')
      .eq('quote_id', quoteId)
      .single();
    if (error) throw error;

    if (!quote) return res.status(404).json({ error: "quote_not_found" });

    const { error: uq } = await supabaseAdmin
      .from('quotes')
      .update({ status: 'confirmed' })
      .eq('quote_id', quoteId);
    if (uq) throw uq;
    const { error: up } = await supabaseAdmin
      .from('payments')
      .update({ status: 'confirmed' })
      .eq('quote_id', quoteId);
    if (up) throw up;

    const { data: updated, error: ue } = await supabaseAdmin
      .from('quotes')
      .select('status,tx_hash')
      .eq('quote_id', quoteId)
      .single();
    if (ue) throw ue;
    return res.json({ ok: true, status: updated?.status, txHash: updated?.tx_hash });
  } catch (error) {
    console.error("Admin confirm error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/payment/admin/confirm", async (req, res) => {
  try {
    const { token, quoteId } = req.body || {};
    if (!token || token !== ADMIN_TOKEN) return res.status(401).json({ error: "unauthorized" });
    if (!quoteId) return res.status(400).json({ error: "invalid_body" });
    const { data: quote, error } = await supabaseAdmin
      .from('quotes')
      .select('*')
      .eq('quote_id', quoteId)
      .single();
    if (error) throw error;
    if (!quote) return res.status(404).json({ error: "quote_not_found" });
    const { error: uq } = await supabaseAdmin
      .from('quotes')
      .update({ status: 'confirmed' })
      .eq('quote_id', quoteId);
    if (uq) throw uq;
    const { error: up } = await supabaseAdmin
      .from('payments')
      .update({ status: 'confirmed' })
      .eq('quote_id', quoteId);
    if (up) throw up;
    const { data: updated, error: ue } = await supabaseAdmin
      .from('quotes')
      .select('status,tx_hash')
      .eq('quote_id', quoteId)
      .single();
    if (ue) throw ue;
    return res.json({ ok: true, status: updated?.status, txHash: updated?.tx_hash });
  } catch (error) {
    console.error("Admin confirm error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create order after confirmation
app.post("/api/orders", authenticateToken, async (req: any, res) => {
  try {
    const { quoteId } = req.body || {};
    if (!quoteId) return res.status(400).json({ error: "invalid_body" });

    const { data: quote, error } = await supabaseAdmin
      .from('quotes')
      .select('*')
      .eq('quote_id', quoteId)
      .eq('user_id', req.user.userId)
      .single();
    if (error) throw error;

    if (!quote) return res.status(404).json({ error: "quote_not_found" });
    if (quote.status !== "confirmed") return res.status(400).json({ error: "not_confirmed" });

    const orderId = "ord_" + Math.random().toString(36).slice(2, 10);
    
    const { data: order, error: oErr } = await supabaseAdmin
      .from('orders')
      .insert({
        order_id: orderId,
        quote_id: quoteId,
        user_id: req.user.userId,
        status: 'created',
        total_usdt: Number(quote.amount_usdt)
      })
      .select('*')
      .single();
    if (oErr) throw oErr;

    // Lier le payment à la commande
    const { error: up } = await supabaseAdmin
      .from('payments')
      .update({ order_id: orderId })
      .eq('quote_id', quoteId);
    if (up) throw up;

    res.json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user orders
app.get("/api/orders", authenticateToken, async (req: any, res) => {
  try {
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('order_id,quote_id,status,total_usdt,created_at')
      .eq('user_id', req.user.userId)
      .order('created_at', { ascending: false });
    if (error) throw error;

    res.json({ orders });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health endpoint
app.get("/api/health", (_, res) => res.json({ ok: true }));
app.get("/health", (_, res) => res.json({ ok: true }));

// Export app for serverless (Vercel)
export default app;

// Local dev server only
if (!process.env.VERCEL) {
  const port = process.env.PORT || 5175;
  app.listen(port, () => {
    console.log(`USDT API listening on http://localhost:${port}`);
  });
}
