# 💰 Configuration des Adresses USDT

## 🎯 Comment configurer vos vraies adresses de portefeuille

Votre système utilise des **variables d'environnement** pour stocker vos adresses USDT. Voici comment les configurer :

### 1. 📁 Créez un fichier `.env` à la racine du projet

```bash
# Dans le répertoire racine de votre projet
touch .env
```

### 2. 🔑 Ajoutez vos vraies adresses USDT

Copiez ce contenu dans votre fichier `.env` et **remplacez par vos vraies adresses** :

```env
# =================================================
# ADRESSES USDT POUR RECEVOIR LES PAIEMENTS
# =================================================

# Adresse USDT sur réseau TRON (TRC-20) - Frais très bas (~1 USDT)
WALLET_TRC20=VOTRE_VRAIE_ADRESSE_TRON_ICI

# Adresse USDT sur réseau Ethereum (ERC-20) - Frais élevés (~10-50 USDT)  
WALLET_ERC20=VOTRE_VRAIE_ADRESSE_ETHEREUM_ICI

# Adresse USDT sur réseau Binance Smart Chain (BEP-20) - Frais moyens (~1-5 USDT)
WALLET_BEP20=VOTRE_VRAIE_ADRESSE_BSC_ICI

# =================================================
# CONFIGURATION SUPABASE
# =================================================
SUPABASE_URL=https://votre-projet-id.supabase.co
SUPABASE_ANON_KEY=votre_clé_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key

# =================================================
# VARIABLES FRONTEND (doivent commencer par VITE_)
# =================================================
VITE_SUPABASE_URL=https://votre-projet-id.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anon_key
```

### 3. 🔍 Formats d'adresses valides

- **TRC-20 (TRON)** : Commence par `T`, ex: `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`
- **ERC-20 (Ethereum)** : Commence par `0x`, ex: `0xdAC17F958D2ee523a2206206994597C13D831ec7`
- **BEP-20 (BSC)** : Commence par `0x`, ex: `0x55d398326f99059fF775485246999027B3197955`

### 4. 📍 Où le système utilise ces adresses

Le code utilise ces variables ici :

#### Server backend (`server/index.ts` et `server/index-prisma.ts`)
```typescript
const addressByNet: Record<string, string> = {
  "TRC-20": process.env.WALLET_TRC20 || "TXMockTronAddr9999999999999999999999",
  "ERC-20": process.env.WALLET_ERC20 || "0xMockEthereumAddress0000000000000000", 
  "BEP-20": process.env.WALLET_BEP20 || "0xMockBscAddress00000000000000000000",
};
```

#### Fonction Supabase (`supabase/functions/create-payment-quote/index.ts`)
```typescript
const addresses: Record<string, string> = {
  'TRC-20': 'TYour-TRON-Address-Here',     // ← À remplacer
  'ERC-20': '0xYour-Ethereum-Address-Here', // ← À remplacer  
  'BEP-20': '0xYour-BSC-Address-Here',      // ← À remplacer
};
```

### 5. ⚠️ Sécurité importante

- **Jamais commit** le fichier `.env` sur Git
- Utilisez des **adresses dédiées** au e-commerce si possible
- **Testez** d'abord avec de petits montants
- **Sauvegardez** vos clés privées en sécurité

### 6. 🚀 Redémarrer après modification

Après avoir modifié le `.env`, redémarrez votre serveur :
```bash
npm run dev
# ou
pnpm dev
```

### 7. 🧪 Test de validation

Une fois configuré, faites un test avec un petit montant pour vérifier que les paiements arrivent bien sur vos adresses.

---

## 📊 Recommandations par réseau

| Réseau | Frais | Vitesse | Recommandation |
|--------|-------|---------|----------------|
| **TRC-20** | ~1 USDT | 1-3 min | ✅ **Recommandé** pour la plupart des clients |
| **BEP-20** | ~1-5 USDT | 1-3 min | ✅ Bon compromis |  
| **ERC-20** | ~10-50 USDT | 5-15 min | ⚠️ Réservé aux gros montants |

**Conseil** : Mettez TRC-20 par défaut pour minimiser les frais clients.
