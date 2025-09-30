import express from "express";
import cors from "cors";
import { Quotes, Orders } from "./db";

const app = express();
app.use(cors());
app.use(express.json());

type StoredQuoteStatus = "pending" | "submitted" | "confirmed" | "expired";

app.post("/api/payment/quote", (req, res) => {
  const { currency, amount, network } = req.body || {};
  if (!currency || typeof amount !== "number" || !network) {
    return res.status(400).json({ error: "invalid_body" });
  }
  // Mock conversion: 1 USDT = 1 EUR for dev; lock 15 minutes
  const amountUSDT = amount.toFixed(2);
  const quoteId = Math.random().toString(36).slice(2, 10);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  // Address per network from env (fallback to mock for dev)
  const addressByNet: Record<string, string> = {
    "TRC-20": process.env.WALLET_TRC20 || "TXMockTronAddr9999999999999999999999",
    "ERC-20": process.env.WALLET_ERC20 || "0xMockEthereumAddress0000000000000000",
    "BEP-20": process.env.WALLET_BEP20 || "0xMockBscAddress00000000000000000000",
  };
  const address = addressByNet[network] || addressByNet["TRC-20"];
  const stored = {
    quoteId,
    amountUSDT,
    network,
    address,
    expiresAt,
    createdAt: Date.now(),
    status: "pending" as StoredQuoteStatus,
  };
  Quotes.insert(stored);
  res.json({ quoteId, amountUSDT, network, address, expiresAt });
});

// Simple health endpoint
app.get("/api/health", (_, res) => res.json({ ok: true }));

// Mock payment status endpoint with simplistic state machine
// - pending for first 10s, then confirmed if not expired
// - expired after expiresAt
app.get("/api/payment/status/:quoteId", (req, res) => {
  const { quoteId } = req.params as { quoteId: string };
  const q = Quotes.get(quoteId);
  if (!q) return res.status(404).json({ error: "not_found" });
  const now = Date.now();
  const expiresMs = new Date(q.expiresAt).getTime();
  if (now >= expiresMs) {
    Quotes.updateStatus(quoteId, "expired");
    return res.json({ status: "expired" });
  }
  // Manual flow: reflect current stored status; if submitted, keep pending until admin confirms
  if (q.status === "submitted") {
    return res.json({ status: q.status, txHash: q.txHash });
  }
  if (q.status === "confirmed") {
    return res.json({ status: q.status, confirmations: 1, txHash: q.txHash });
  }
  return res.json({ status: q.status });
});

// Submit a tx hash for a quote (customer-provided)
app.post("/api/payment/submit-tx", (req, res) => {
  const { quoteId, txHash } = req.body || {};
  if (!quoteId || !txHash || typeof txHash !== "string") {
    return res.status(400).json({ error: "invalid_body" });
  }
  const q = Quotes.get(quoteId);
  if (!q) return res.status(404).json({ error: "quote_not_found" });
  const now = Date.now();
  const expiresMs = new Date(q.expiresAt).getTime();
  if (now >= expiresMs) return res.status(400).json({ error: "expired" });
  Quotes.submitTx(quoteId, txHash);
  return res.json({ ok: true, status: q.status, txHash: q.txHash });
});

// Admin confirmation endpoint (manual validation)
app.post("/api/payment/admin/confirm", (req, res) => {
  const adminToken = process.env.ADMIN_TOKEN || "dev_admin_token";
  const { token, quoteId } = req.body || {};
  if (!token || token !== adminToken) return res.status(401).json({ error: "unauthorized" });
  if (!quoteId) return res.status(400).json({ error: "invalid_body" });
  const q = Quotes.get(quoteId);
  if (!q) return res.status(404).json({ error: "quote_not_found" });
  Quotes.updateStatus(quoteId, "confirmed");
  const updated = Quotes.get(quoteId);
  return res.json({ ok: true, status: updated?.status, txHash: updated?.txHash });
});

// Simpler: GET endpoint to confirm from browser: /api/payment/admin/confirm?token=...&quoteId=...
app.get("/api/payment/admin/confirm", (req, res) => {
  const adminToken = process.env.ADMIN_TOKEN || "dev_admin_token";
  const token = req.query.token as string | undefined;
  const quoteId = req.query.quoteId as string | undefined;
  if (!token || token !== adminToken) return res.status(401).send("unauthorized");
  if (!quoteId) return res.status(400).send("invalid query");
  const q = Quotes.get(quoteId);
  if (!q) return res.status(404).send("quote not found");
  Quotes.updateStatus(quoteId, "confirmed");
  return res.send(`confirmed ${quoteId}`);
});

// Mock order creation after confirmation
app.post("/api/orders", (req, res) => {
  const { quoteId } = req.body || {};
  if (!quoteId) return res.status(400).json({ error: "invalid_body" });
  const q = Quotes.get(quoteId);
  if (!q) return res.status(404).json({ error: "quote_not_found" });
  if (q.status !== "confirmed") return res.status(400).json({ error: "not_confirmed" });
  const orderId = "ord_" + Math.random().toString(36).slice(2, 10);
  const order = { orderId, quoteId, status: "created", totalUSDT: q.amountUSDT, createdAt: Date.now() };
  Orders.insert(order);
  res.json(order);
});

const port = process.env.PORT || 5175;
app.listen(port, () => {
  console.log(`Mock USDT API listening on http://localhost:${port}`);
});


