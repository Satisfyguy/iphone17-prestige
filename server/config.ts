// Configuration pour le développement local
export const config = {
  database: {
    url: process.env.DATABASE_URL || "postgresql://username:password@localhost:5432/iphone17_prestige?schema=public"
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production"
  },
  admin: {
    token: process.env.ADMIN_TOKEN || "dev_admin_token"
  },
  wallets: {
    trc20: process.env.WALLET_TRC20 || "TXMockTronAddr9999999999999999999999",
    erc20: process.env.WALLET_ERC20 || "0xMockEthereumAddress0000000000000000",
    bep20: process.env.WALLET_BEP20 || "0xMockBscAddress00000000000000000000"
  }
};
