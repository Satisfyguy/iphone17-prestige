# Configuration de l'Offre de Lancement iPhone 17

## 🚀 Fonctionnalités Implémentées

### ✅ Offre de Lancement Complète
- **Stock limité**: 10 pièces par produit
- **Réduction**: -20% sur tous les modèles
- **Exclusivité**: 1 pièce par client maximum
- **Urgence**: Timer de fin d'offre (15 octobre 2025, 23:59)
- **Transparence**: Prix après lancement visible

### ✅ Éléments Visuels
- **Barre sticky**: Annonce site-wide avec timer
- **Hero section**: Message de lancement avec badges
- **Cartes produits**: Badges "Série limitée" et "-20% lancement"
- **Page produit**: Stock en temps réel, prix barrés, urgence
- **Footer**: Disclaimer légal complet

### ✅ Gestion du Stock
- **Redis**: Gestion temps réel du stock et réservations
- **Réservations**: 10 minutes par produit
- **États**: Disponible, Réservé, Vendu, Épuisé

## 📋 Configuration Requise

### 1. Variables d'Environnement
Créez un fichier `.env.local` à la racine du projet :

```env
# Configuration de l'offre de lancement
VITE_LAUNCH_END_AT=2025-10-15T23:59:59+02:00
VITE_RESERVATION_TTL_SECONDS=600

# Configuration Redis Upstash (OPTIONNEL pour le développement)
VITE_UPSTASH_REDIS_REST_URL=your_upstash_redis_url_here
VITE_UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token_here
```

**Note** : Sans Redis, l'application fonctionne en mode développement avec un stock simulé.

### 2. Configuration Redis Upstash
1. Allez sur [https://console.upstash.com/](https://console.upstash.com/)
2. Créez un compte (gratuit)
3. Créez une nouvelle base Redis
4. Copiez l'URL REST et le token REST
5. Ajoutez-les dans votre `.env.local`

### 3. Installation des Dépendances
```bash
pnpm install
```

Les dépendances suivantes ont été ajoutées :
- `@upstash/redis` : Gestion du stock en temps réel
- `uuid` : Génération d'identifiants uniques
- `date-fns` : Gestion des dates (déjà présent)

## 🎯 Composants Créés

### Nouveaux Composants
- `LaunchOfferBar` : Barre sticky avec timer
- `ReservationTimer` : Timer de réservation produit
- Hooks : `useStock`, `useReservations`, `useSessionId`

### Utilitaires
- `lib/redis.ts` : Gestion Redis et stock
- `lib/launch-offer.ts` : Logique de l'offre de lancement
- `lib/env.ts` : Configuration environnement

## 📊 Données Produits Mises à Jour

Tous les produits incluent maintenant :
- `price` : Prix après lancement (référence)
- `launchPrice` : Prix avec -20%
- `savings` : Économies réalisées

### Prix Actuels
- **iPhone 17** : 775€ au lieu de 969€ (-194€)
- **iPhone Air** : 983€ au lieu de 1229€ (-246€)
- **iPhone 17 Pro** : 1063€ au lieu de 1329€ (-266€)
- **iPhone 17 Pro Max** : 1183€ au lieu de 1479€ (-296€)

## 🔧 Personnalisation

### Modifier la Date de Fin
Dans `src/lib/launch-offer.ts`, ligne 6 :
```typescript
endDate: new Date('2025-10-15T23:59:59+02:00'),
```

### Modifier le Stock Initial
Dans `src/lib/launch-offer.ts`, ligne 8 :
```typescript
stockPerProduct: 10,
```

### Modifier la Réduction
Dans `src/lib/launch-offer.ts`, ligne 7 :
```typescript
discountPercentage: 20,
```

## 🚦 États du Stock

### Badges Dynamiques
- **Stock > 5** : "Série limitée"
- **Stock 3-5** : "Dernières pièces" (orange)
- **Stock 1-3** : "Stock limité" (rouge)
- **Stock = 0** : "Épuisé" (rouge)

### Messages d'Urgence
- **Stock > 5** : "X/10 disponibles"
- **Stock ≤ 5** : "Plus que X/10 disponibles"
- **Stock = 0** : "Épuisé (10/10 vendus)"

## 🎨 Design System

### Couleurs Utilisées
- **Vert** : Prix de lancement, économies
- **Rouge** : Urgence, stock limité, timer
- **Orange** : Avertissements, stock faible
- **Bleu** : Informations, livraison

### Animations
- **Pulse** : Points rouges, timer urgent
- **Fade-in** : Apparition des éléments
- **Scale** : Hover sur les boutons

## 📱 Responsive Design

Tous les composants sont optimisés pour :
- **Mobile** : Affichage compact, informations essentielles
- **Tablet** : Layout adaptatif
- **Desktop** : Expérience complète

## 🔍 SEO et Performance

### Optimisations
- **Meta tags** : Prix de lancement dans les descriptions
- **Schema.org** : Prix mis à jour automatiquement
- **Images** : Lazy loading, formats optimisés
- **Fonts** : Preload des polices critiques

## 🚀 Déploiement

### Checklist Avant Lancement
- [ ] Configuration Redis Upstash
- [ ] Variables d'environnement définies
- [ ] Date de fin d'offre configurée
- [ ] Test du timer en temps réel
- [ ] Test des réservations
- [ ] Vérification mobile/desktop

### Commandes
```bash
# Développement
pnpm dev

# Build de production
pnpm build

# Preview
pnpm preview
```

## 📈 Monitoring

### Métriques à Surveiller
- Stock restant par produit
- Nombre de réservations actives
- Taux de conversion réservation → achat
- Performance du timer

### Logs Redis
Les opérations Redis sont loggées pour le debugging.

## 🆘 Dépannage

### Problèmes Courants

**Timer ne s'affiche pas** :
- Vérifiez `NEXT_PUBLIC_LAUNCH_END_AT` dans `.env.local`
- Format requis : ISO 8601 avec timezone

**Stock ne se met pas à jour** :
- Vérifiez les credentials Upstash Redis
- Testez la connexion Redis

**Prix incorrects** :
- Vérifiez les calculs dans `src/data/products.ts`
- Prix de lancement = prix original × 0.8

## 📞 Support

Pour toute question technique :
1. Vérifiez ce README
2. Consultez les logs de la console
3. Testez avec des données de développement

---

**🎉 L'offre de lancement est maintenant prête !**

Tous les éléments demandés ont été implémentés :
- Barre sticky avec timer
- Hero section mise à jour
- Badges sur les produits
- Page produit complète avec stock
- Système de réservation
- Disclaimer légal
- Design responsive et moderne
