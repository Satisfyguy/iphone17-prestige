import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "dev_admin_token";

type StoredQuoteStatus = "pending" | "submitted" | "confirmed" | "expired";

// Middleware d'authentification
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

// ===== AUTHENTICATION ENDPOINTS =====

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone
      }
    });

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user profile
app.get("/api/auth/profile", authenticateToken, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        city: true,
        country: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update user profile
app.put("/api/auth/profile", authenticateToken, async (req: any, res) => {
  try {
    const { firstName, lastName, phone, address, city, country } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        firstName,
        lastName,
        phone,
        address,
        city,
        country
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        city: true,
        country: true
      }
    });

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

    // Mock conversion: 1 USDT = 1 EUR for dev; lock 15 minutes
    const amountUSDT = amount.toFixed(2);
    const quoteId = Math.random().toString(36).slice(2, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    
    // Address per network from env (fallback to mock for dev)
    const addressByNet: Record<string, string> = {
      "TRC-20": process.env.WALLET_TRC20 || "TXMockTronAddr9999999999999999999999",
      "ERC-20": process.env.WALLET_ERC20 || "0xMockEthereumAddress0000000000000000",
      "BEP-20": process.env.WALLET_BEP20 || "0xMockBscAddress00000000000000000000",
    };
    const address = addressByNet[network] || addressByNet["TRC-20"];

    // Créer la quote avec l'utilisateur
    const quote = await prisma.quote.create({
      data: {
        quoteId,
        amountUSDT,
        network,
        address,
        expiresAt,
        status: "pending",
        userId: req.user.userId
      }
    });

    res.json({ 
      quoteId, 
      amountUSDT, 
      network, 
      address, 
      expiresAt: quote.expiresAt.toISOString() 
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
    
    const quote = await prisma.quote.findFirst({
      where: {
        quoteId,
        userId: req.user.userId // Vérifier que la quote appartient à l'utilisateur
      }
    });

    if (!quote) return res.status(404).json({ error: "not_found" });

    const now = new Date();
    if (now >= quote.expiresAt) {
      await prisma.quote.update({
        where: { quoteId },
        data: { status: "expired" }
      });
      return res.json({ status: "expired" });
    }

    if (quote.status === "submitted") {
      return res.json({ status: quote.status, txHash: quote.txHash });
    }
    if (quote.status === "confirmed") {
      return res.json({ status: quote.status, confirmations: 1, txHash: quote.txHash });
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

    const quote = await prisma.quote.findFirst({
      where: {
        quoteId,
        userId: req.user.userId
      }
    });

    if (!quote) return res.status(404).json({ error: "quote_not_found" });

    const now = new Date();
    if (now >= quote.expiresAt) return res.status(400).json({ error: "expired" });

    await prisma.quote.update({
      where: { quoteId },
      data: { txHash, status: "submitted" }
    });

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

    const quote = await prisma.quote.findUnique({
      where: { quoteId }
    });

    if (!quote) return res.status(404).json({ error: "quote_not_found" });

    await prisma.quote.update({
      where: { quoteId },
      data: { status: "confirmed" }
    });

    const updated = await prisma.quote.findUnique({
      where: { quoteId }
    });

    return res.json({ ok: true, status: updated?.status, txHash: updated?.txHash });
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

    const quote = await prisma.quote.findFirst({
      where: {
        quoteId,
        userId: req.user.userId
      }
    });

    if (!quote) return res.status(404).json({ error: "quote_not_found" });
    if (quote.status !== "confirmed") return res.status(400).json({ error: "not_confirmed" });

    const orderId = "ord_" + Math.random().toString(36).slice(2, 10);
    
    const order = await prisma.order.create({
      data: {
        orderId,
        quoteId,
        userId: req.user.userId,
        status: "created",
        totalUSDT: quote.amountUSDT
      }
    });

    res.json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user orders
app.get("/api/orders", authenticateToken, async (req: any, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      include: {
        quote: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ orders });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health endpoint
app.get("/api/health", (_, res) => res.json({ ok: true }));

const port = process.env.PORT || 5175;
app.listen(port, () => {
  console.log(`USDT API with Prisma listening on http://localhost:${port}`);
});
