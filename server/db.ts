import Database from "better-sqlite3";

const dbPath = process.env.SQLITE_PATH || "./data.db";
export const db = new Database(dbPath);

// initialize tables
db.exec(`
CREATE TABLE IF NOT EXISTS quotes (
  quoteId TEXT PRIMARY KEY,
  amountUSDT TEXT NOT NULL,
  network TEXT NOT NULL,
  address TEXT NOT NULL,
  expiresAt TEXT NOT NULL,
  createdAt INTEGER NOT NULL,
  status TEXT NOT NULL,
  txHash TEXT
);

CREATE TABLE IF NOT EXISTS orders (
  orderId TEXT PRIMARY KEY,
  quoteId TEXT NOT NULL,
  status TEXT NOT NULL,
  totalUSDT TEXT NOT NULL,
  createdAt INTEGER NOT NULL,
  FOREIGN KEY (quoteId) REFERENCES quotes(quoteId)
);
`);

export type QuoteRow = {
  quoteId: string;
  amountUSDT: string;
  network: string;
  address: string;
  expiresAt: string;
  createdAt: number;
  status: string;
  txHash?: string | null;
};

export type OrderRow = {
  orderId: string;
  quoteId: string;
  status: string;
  totalUSDT: string;
  createdAt: number;
};

export const Quotes = {
  insert(q: QuoteRow) {
    const params = {
      ...q,
      txHash: q.txHash ?? null,
    } as const;
    db.prepare(`INSERT INTO quotes (quoteId, amountUSDT, network, address, expiresAt, createdAt, status, txHash)
      VALUES (@quoteId, @amountUSDT, @network, @address, @expiresAt, @createdAt, @status, @txHash)`).run(params);
  },
  get(quoteId: string): QuoteRow | undefined {
    return db.prepare(`SELECT * FROM quotes WHERE quoteId = ?`).get(quoteId) as QuoteRow | undefined;
  },
  updateStatus(quoteId: string, status: string) {
    db.prepare(`UPDATE quotes SET status = ? WHERE quoteId = ?`).run(status, quoteId);
  },
  submitTx(quoteId: string, txHash: string) {
    db.prepare(`UPDATE quotes SET txHash = ?, status = 'submitted' WHERE quoteId = ?`).run(txHash, quoteId);
  }
};

export const Orders = {
  insert(o: OrderRow) {
    db.prepare(`INSERT INTO orders (orderId, quoteId, status, totalUSDT, createdAt)
      VALUES (@orderId, @quoteId, @status, @totalUSDT, @createdAt)`).run(o);
  },
  get(orderId: string): OrderRow | undefined {
    return db.prepare(`SELECT * FROM orders WHERE orderId = ?`).get(orderId) as OrderRow | undefined;
  }
};


