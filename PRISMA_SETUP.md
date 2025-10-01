# Configuration Prisma et Authentification

## 🚀 Configuration requise

### 1. Base de données PostgreSQL
Vous devez avoir PostgreSQL installé et configuré. Créez une base de données :

```sql
CREATE DATABASE iphone17_prestige;
```

### 2. Variables d'environnement
Créez un fichier `.env` à la racine du projet avec :

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/iphone17_prestige?schema=public"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Admin Token
ADMIN_TOKEN="dev_admin_token"

# Wallet Addresses (optionnel)
WALLET_TRC20=""
WALLET_ERC20=""
WALLET_BEP20=""
```

### 3. Exécution des migrations
```bash
# Générer le client Prisma
npx prisma generate

# Exécuter les migrations
npx prisma migrate dev --name init

# (Optionnel) Visualiser la base de données
npx prisma studio
```

## 🔧 Scripts disponibles

### Serveur avec Prisma (nouveau)
```bash
npm run dev:server-prisma
```

### Serveur SQLite (ancien)
```bash
npm run dev:server
```

## 📡 Endpoints d'authentification

### POST /api/auth/register
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

### POST /api/auth/login
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### GET /api/auth/profile
Headers: `Authorization: Bearer <token>`

### PUT /api/auth/profile
Headers: `Authorization: Bearer <token>`
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "address": "123 Main St",
  "city": "Paris",
  "country": "France"
}
```

## 💳 Endpoints de paiement (avec authentification)

Tous les endpoints de paiement nécessitent maintenant un token JWT dans le header `Authorization: Bearer <token>`.

### POST /api/payment/quote
### GET /api/payment/status/:quoteId
### POST /api/payment/submit-tx
### POST /api/orders
### GET /api/orders

## 🔐 Sécurité

- Les mots de passe sont hashés avec bcrypt
- Les tokens JWT expirent après 24h
- Chaque utilisateur ne peut voir que ses propres quotes et commandes
- Endpoint admin pour confirmer les paiements

## 🗄️ Modèles de données

### User
- id, email, password (hashé)
- firstName, lastName, phone
- address, city, country
- createdAt, updatedAt

### Quote (liée à User)
- quoteId, amountUSDT, network, address
- expiresAt, status, txHash
- userId (relation vers User)

### Order (liée à User et Quote)
- orderId, quoteId, userId
- status, totalUSDT, createdAt
