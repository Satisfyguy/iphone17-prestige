# 🔒 Configuration Sécurisée pour la Production

## ❌ **À ÉVITER en production**
- ✗ Fichier `.env` committé sur Git
- ✗ Adresses hardcodées dans le code
- ✗ Variables sensibles dans le repository

## ✅ **Solutions sécurisées pour la production**

### 1. 🚀 **Vercel (recommandé pour ce projet)**

#### Dashboard Vercel - Variables d'environnement
```bash
# Dans votre projet Vercel, onglet "Settings" > "Environment Variables"
WALLET_TRC20 = votre_vraie_adresse_tron
WALLET_ERC20 = votre_vraie_adresse_ethereum  
WALLET_BEP20 = votre_vraie_adresse_bsc
```

#### Via Vercel CLI
```bash
# Ajouter une variable
vercel env add WALLET_TRC20 production
> Entrez votre adresse TRON

# Lister les variables
vercel env ls
```

### 2. 🔥 **Supabase Edge Functions**

#### Dashboard Supabase
```bash
# Projet Supabase > Settings > Edge Functions > Environment Variables
WALLET_TRC20 = votre_adresse_tron
WALLET_ERC20 = votre_adresse_ethereum
WALLET_BEP20 = votre_adresse_bsc
```

#### Via Supabase CLI
```bash
# Créer un fichier supabase/.env (jamais committé)
echo "WALLET_TRC20=votre_adresse" >> supabase/.env

# Déployer avec les variables
supabase functions deploy create-payment-quote --no-verify-jwt
```

### 3. ☁️ **Autres solutions cloud**

#### Netlify
```bash
# Dashboard: Site settings > Environment variables
# Ou via CLI:
netlify env:set WALLET_TRC20 "votre_adresse"
```

#### Railway
```bash
# Dashboard: Project > Variables
# Variables chiffrées automatiquement
```

#### AWS / Azure / GCP
```bash
# AWS: Systems Manager Parameter Store
# Azure: Key Vault  
# GCP: Secret Manager
```

## 🛡️ **Architecture sécurisée recommandée**

### Option 1: **Adresses dynamiques par commande** (le plus sécurisé)
```typescript
// Générer une nouvelle adresse pour chaque commande
const uniqueAddress = await generateUniqueAddress(network, orderId);
```

### Option 2: **Pool d'adresses pré-générées**
```typescript
// Rotation d'adresses depuis un pool sécurisé
const addressPool = await getAvailableAddress(network);
```

### Option 3: **Adresses fixes avec sous-adresses**
```typescript
// Utiliser des memo/tags pour identifier les paiements
const address = FIXED_ADDRESS;
const memo = `ORDER_${orderId}`;
```

## 🔐 **Variables d'environnement par service**

### **Frontend (Vercel/Netlify)**
```env
# Seules les variables VITE_ sont exposées côté client
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### **Backend/API (Vercel Functions)**  
```env
# Variables serveur sensibles
WALLET_TRC20=TR7NHqjeKQx...
WALLET_ERC20=0xdAC17F958D2ee...
WALLET_BEP20=0x55d398326f99...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### **Supabase Edge Functions**
```env
# Variables pour les fonctions Edge
WALLET_TRC20=TR7NHqjeKQx...
WALLET_ERC20=0xdAC17F958D2ee...
WALLET_BEP20=0x55d398326f99...
```

## 📋 **Checklist de sécurité production**

### ✅ **Configuration**
- [ ] Variables dans le dashboard cloud (pas en fichier)
- [ ] Fichier `.env` dans `.gitignore`
- [ ] Variables différentes dev/staging/prod
- [ ] Rotation périodique des secrets

### ✅ **Monitoring**
- [ ] Logs des transactions
- [ ] Alertes sur les paiements inhabituels
- [ ] Backup des configurations
- [ ] Tests de réception sur nouvelles adresses

### ✅ **Accès**
- [ ] Accès limité aux variables de prod
- [ ] 2FA activé sur tous les comptes
- [ ] Équipe technique minimale
- [ ] Audit trail des modifications

## 🚀 **Déploiement recommandé pour votre projet**

### **Étape 1: Vercel Frontend + API**
```bash
# 1. Connecter votre repo GitHub à Vercel
# 2. Configurer les variables dans Vercel Dashboard
# 3. Déployer automatiquement
```

### **Étape 2: Supabase Backend**
```bash
# 1. Configurer les variables dans Supabase Dashboard  
# 2. Déployer les Edge Functions
supabase functions deploy
```

### **Étape 3: Test de production**
```bash
# Tester avec de petits montants
# Vérifier réception sur vos wallets
# Valider tous les réseaux (TRC-20, ERC-20, BEP-20)
```

## ⚠️ **IMPORTANT**

1. **Jamais de secrets dans le code** committé
2. **Variables différentes** par environnement  
3. **Tests de réception** avant mise en production
4. **Monitoring actif** des paiements
5. **Backup des configurations** critiques

## 💡 **Recommandation finale**

Pour votre projet iPhone 17, utilisez :
- **Vercel** pour le frontend + API Routes
- **Supabase** pour les Edge Functions + DB
- **Variables dans les dashboards** (jamais en fichier)
- **Tests avec petits montants** avant le lancement
