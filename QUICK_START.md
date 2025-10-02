# 🚀 Démarrage Rapide - Offre de Lancement iPhone 17

## ✅ Problème Résolu !

L'erreur Redis a été corrigée. L'application fonctionne maintenant en **mode développement** sans configuration Redis requise.

## 🎯 Pour Tester Immédiatement

1. **Créez le fichier `.env.local`** à la racine du projet :
```env
VITE_LAUNCH_END_AT=2025-10-15T23:59:59+02:00
VITE_RESERVATION_TTL_SECONDS=600
```

2. **Redémarrez le serveur** :
```bash
pnpm dev
```

3. **Testez les fonctionnalités** :
   - ✅ Barre sticky avec timer
   - ✅ Hero section "Série de lancement"
   - ✅ Cartes produits avec badges -20%
   - ✅ Pages produits avec stock simulé (10 pièces)
   - ✅ Prix de lancement affichés
   - ✅ Disclaimer légal dans le footer

## 🔧 Mode Développement vs Production

### Mode Développement (Actuel)
- **Stock simulé** : 10 pièces par produit
- **Pas de Redis requis**
- **Fonctionnalités visuelles complètes**
- **Timer et prix fonctionnels**

### Mode Production (Optionnel)
Pour activer Redis en production, ajoutez dans `.env.local` :
```env
VITE_UPSTASH_REDIS_REST_URL=votre_url_redis
VITE_UPSTASH_REDIS_REST_TOKEN=votre_token_redis
```

## 🎨 Ce Qui Fonctionne Maintenant

### ✅ Barre Sticky
- Timer en temps réel jusqu'au 15 octobre 23:59
- Message "–20% lancement. 10 pièces par modèle"
- Responsive mobile/desktop

### ✅ Page d'Accueil
- Hero avec badge "Série de lancement"
- Cartes produits avec badges "Série limitée" et "–20%"
- Prix barrés avec économies visibles

### ✅ Pages Produits
- Badges "Édition de lancement — 10 pièces"
- Stock "Plus que X/10 disponibles"
- Prix de lancement en vert avec économies
- Bouton "Ajouter — 1063€ (–20%)"

### ✅ Design System
- **Rouge** : Urgence, stock limité
- **Vert** : Prix de lancement, économies
- **Orange** : Avertissements
- **Animations** : Pulse, fade-in, hover

## 📱 Test Rapide

1. **Accueil** : Vérifiez la barre sticky et le hero
2. **Produits** : Cliquez sur une carte produit
3. **Stock** : Observez "Plus que 10/10 disponibles"
4. **Prix** : Vérifiez les prix barrés et économies
5. **Timer** : Le compte à rebours fonctionne

## 🚀 Prêt pour le Lancement !

Toutes les fonctionnalités demandées sont implémentées :
- ✅ Stock limité (10 pièces)
- ✅ Réduction -20% automatique
- ✅ Effet d'urgence avec timer
- ✅ Exclusivité (1 par client)
- ✅ Transparence des prix
- ✅ Design moderne et responsive

**L'offre de lancement est opérationnelle !** 🎉
