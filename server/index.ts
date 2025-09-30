import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

type StoredQuote = {
  quoteId: string;
  amountUSDT: string;
  network: string;
  address: string;
  expiresAt: string;
  createdAt: number;
};

const quotesStore = new Map<string, StoredQuote>();

app.post("/api/payment/quote", (req, res) => {
  const { currency, amount, network } = req.body || {};
  if (!currency || typeof amount !== "number" || !network) {
    return res.status(400).json({ error: "invalid_body" });
  }
  // Mock conversion: 1 USDT = 1 EUR for dev; lock 15 minutes
  const amountUSDT = amount.toFixed(2);
  const quoteId = Math.random().toString(36).slice(2, 10);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  // Fake address per network
  const addressByNet: Record<string, string> = {
    "TRC-20": "TXMockTronAddr9999999999999999999999",
    "ERC-20": "0xMockEthereumAddress0000000000000000",
    "BEP-20": "0xMockBscAddress00000000000000000000",
  };
  const address = addressByNet[network] || addressByNet["TRC-20"];
  const stored: StoredQuote = {
    quoteId,
    amountUSDT,
    network,
    address,
    expiresAt,
    createdAt: Date.now(),
  };
  quotesStore.set(quoteId, stored);
  res.json({ quoteId, amountUSDT, network, address, expiresAt });
});

// Simple health endpoint
app.get("/api/health", (_, res) => res.json({ ok: true }));

// Mock payment status endpoint with simplistic state machine
// - pending for first 10s, then confirmed if not expired
// - expired after expiresAt
app.get("/api/payment/status/:quoteId", (req, res) => {
  const { quoteId } = req.params as { quoteId: string };
  const q = quotesStore.get(quoteId);
  if (!q) return res.status(404).json({ error: "not_found" });
  const now = Date.now();
  const expiresMs = new Date(q.expiresAt).getTime();
  if (now >= expiresMs) {
    return res.json({ status: "expired" });
  }
  const age = now - q.createdAt;
  if (age < 10_000) {
    return res.json({ status: "pending", confirmations: 0 });
  }
  // after 10s, consider confirmed in mock
  return res.json({ status: "confirmed", confirmations: 1, txHash: "MOCK_TRX_HASH_" + quoteId });
});

const port = process.env.PORT || 5175;
app.listen(port, () => {
  console.log(`Mock USDT API listening on http://localhost:${port}`);
});


