## Roadmap de mise en production

Ce document liste les tâches principales et secondaires (style task manager) pour finaliser le passage en production. Utilisez les cases à cocher pour suivre l'avancement.

### Légende
- **[ ]** à faire  •  **[~]** en cours  •  **[x]** fait
- **Priorité**: P0 (critique) / P1 (haute) / P2 (moyenne) / P3 (basse)

---

## P0 — Paiement (USDT), Checkout, Commande (bloquants prod)

- [ ] Checkout — Page et flux de commande (P0)
  - [x] Créer page `Checkout` (récap panier, adresse, livraison, paiement)
  - [ ] Validation des champs (adresse, contact) + états d'erreur/chargement
  - [x] Lien "Commander" depuis `Panier` vers `Checkout`
  - [ ] Sauvegarde brouillon de checkout dans `localStorage` (UX)

- [~] Intégration Paiement USDT (P0)
  - [ ] Choisir la solution: custodial (Coinbase Commerce, Circle, Binance Pay, NOWPayments, BitPay, Triple-A) vs self-custody (BTCPay Server mod, wallet maison)
  - [x] Définir réseaux acceptés: ERC-20 (Ethereum), TRC-20 (Tron), BEP-20 (BSC) — par défaut TRC-20 pour frais bas
  - [x] Backend: endpoint `POST /api/payment/quote` — crée un devis/checkout avec montant USDT, réseau, timeout (ex: 15 min), adresse de réception unique et mémo si requis
  - [~] Front: page de paiement crypto (adresse, réseau, montant exact; QR/timer à ajouter)
  - [ ] Confirmations blockchain: configurable (ex: 1 conf TRC-20 / 6 conf ERC-20) + gestion pending/confirmé/échoué
  - [x] Polling du statut + endpoints `submit-tx` et `admin/confirm` (mock)
  - [ ] Gestion des écarts: sous‑paiement, sur‑paiement, réseau incorrect, double spend, expiré — règles business (complément, remboursement, avoir)
  - [ ] Réconciliation et idempotence: associer tx hash ↔ commande, éviter double comptabilisation
  - [ ] Sécurité/ops: rotation des clés/API, adresse par commande, pas de réutilisation d’adresse, logs détaillés
  - [ ] QR payload conforme au réseau (tron:, ethereum:, bsc:) + affichage `memo/tag` si requis
  - [ ] Boutons « Copier l’adresse » et « Copier le montant » + feedback visuel
  - [ ] Timer d’expiration avec UX de régénération de devis (même panier)
  - [ ] Polling automatique du statut jusqu’à confirmation/expiration (pas uniquement bouton)
  - [ ] Désactiver modification du panier une fois un devis actif (ou invalider le devis si modification)
  - [ ] Persistance `quotes` et statuts de paiement en base de données (remplacer `Map` mémoire)
 - [x] Persistance `quotes` et statuts de paiement en base de données (Prisma)
  - [ ] Vérification signature des webhooks + politique de retry (exponentiel) + journaux

- [ ] Création/Validation de Commande (P0)
- [x] Backend: `POST /api/orders` (minimal, après confirmation paiement)
  - [ ] Modèle commande (id, lignes, montants, client, statut, paiements, réseau, tx hash, confirmations)
  - [ ] Idempotence sur création de commande (clé idempotency)
  - [ ] Email de confirmation (Resend/SendGrid) + facture PDF (facultatif P1)
- [x] Persistance `orders` en base + liaison `order ↔ quote`
  - [ ] Page de succès (récap complet, lien explorer, justificatif PDF si dispo)

- [ ] Gestion Stock/Produits (P0)
  - [ ] Source de vérité des stocks (DB ou service) + décrément post-paiement confirmé on-chain
  - [ ] Empêcher commande si rupture (vérif au checkout)
  - [ ] Synchronisation avec webhooks/callbacks paiement (statuts)

Dépendances: Paiement USDT dépend du backend minimal et du fournisseur ou watcher on-chain. Commande dépend du statut de paiement (tx confirmée) et du stock.

---

## P0 — Spécificités USDT (devises, conversion, conformité)

- [ ] Devise d’affichage et conversion (P0)
  - [ ] Si site en €: calcul montant USDT à partir de l’EUR via oracle (CoinGecko/Coinbase) au moment du devis
  - [ ] Verrouillage du taux pendant la durée du devis (ex: 15 min) + timer
  - [ ] Arrondis et montant minimal (réseau) — prévenir l’utilisateur

- [ ] Chaînes supportées (P0)
  - [ ] Documenter réseaux acceptés et frais estimés
  - [ ] Lier vers l’explorateur (TronScan/Etherscan/BscScan) depuis la commande

- [ ] Conformité/KYC/AML (P0/P1 selon juridiction)
  - [ ] Politique de remboursement en USDT (même réseau, adresse de retour)
  - [ ] Filtrage adresses sanctionnées (OFAC) si fournisseur le propose
  - [ ] Journaliser provenance tx pour traçabilité

---

## P1 — Authentification, Compte client, Adresses

- [x] Auth (P1)
  - [x] Inscription/Connexion (email + mot de passe)
  - [ ] Reset mot de passe (email)
  - [ ] Sécurisation routes (historique commandes)

- [~] Espace client (P1)
  - [~] Historique commandes + détails (endpoint `GET /api/orders`)
  - [ ] Carnet d'adresses (facturation/livraison)
  - [ ] Reçus/factures téléchargeables

---

## P1 — Fiscalité, Livraison, Légal

- [ ] TVA & devises (P1)
  - [ ] Calcul TVA en fonction du pays (UE) et catégorie produit
  - [ ] Arrondi, affichage TTC/HT cohérent (Intl)

- [ ] Livraison (P1)
  - [ ] Transporteurs et tarifs (Colissimo/Chronopost) + estimation délai
  - [ ] Choix du mode + coût au checkout
  - [ ] Suivi colis: stockage du tracking + lien transporteur

- [ ] Conformité légale UE (P1)
  - [ ] Mentions légales, CGV, Politique de confidentialité
  - [ ] Politique retours/rétractation (formulaire)
  - [ ] Cookies & Consent Mode (bannière, préférences)
  - [ ] DPA/registre RGPD, pages requises

---

## P1 — Qualité, Sécurité, Observabilité

- [ ] Tests (P1)
  - [ ] Unitaires (Vitest) pour hooks (`useCart`, calculs totaux)
  - [ ] E2E (Playwright/Cypress): parcours panier → checkout → paiement mock
  - [ ] Snapshots UI pour composants critiques

- [ ] Sécurité (P1)
  - [ ] HTTPS partout, redirection HTTP→HTTPS
  - [ ] En-têtes: CSP, HSTS, X-Content-Type-Options, Referrer-Policy, COOP/COEP
  - [ ] Stockage secrets (env), rotation, aucun secret côté client

- [ ] Observabilité (P1)
  - [ ] Sentry (front + back) erreurs + sourcemaps
  - [ ] Logs structurés backend (corrélation req-id)
  - [ ] Uptime monitoring + alerting

---

## P1 — SEO, Performance, Accessibilité

- [ ] SEO (P1)
  - [ ] Meta tags, OpenGraph/Twitter Cards
  - [ ] Sitemap.xml, robots.txt, canonical
  - [ ] JSON-LD Produits (prix, dispo) + breadcrumbs

- [ ] Performance (P1)
  - [ ] Code splitting & prefetch routes
  - [ ] Images responsives (srcset), WebP/AVIF, lazy loading
  - [ ] Compression (Brotli/Gzip) + HTTP/2/3
  - [ ] Audit Lighthouse ≥ 90 sur PWA/Perf/SEO/Best Practices

- [ ] Accessibilité (P1)
  - [ ] Navigation clavier, focus states, aria labels
  - [ ] Contrastes, tailles tap targets, erreurs formulaires lisibles

---

## P1 — CI/CD & Ops

- [ ] Pipelines CI (P1)
  - [ ] Lint, typecheck, tests, build — PR gating
  - [ ] Previews sur branches (Vercel/Netlify/Cloudflare Pages)

- [ ] CD (P1)
  - [ ] Déploiement prod avec migrations DB (si applicable)
  - [ ] Stratégie rollback

- [ ] Ops (P1)
  - [ ] Backups DB + restauration testée
  - [ ] Tableaux de bord (erreurs, latence, taux conversion)

---

## P2 — Expérience, Growth, Internationalisation

- [ ] UX (P2)
  - [ ] Sauvegarde panier côté serveur (après login)
  - [ ] Relance panier abandonné (email — consent requis)
  - [ ] Reco produits (cross-sell/upsell) au panier et checkout

- [ ] Internationalisation (P2)
  - [ ] i18n (fr, en) + formats devise/date (Intl)
  - [ ] Hreflang + redirection géo (optionnel)

---

## Suivis transverses

- [ ] Harmoniser libellés stockage (Go/GB/TB) dans `products.ts` (P3)
- [ ] Clés React de `Panier`: retirer l'index et n'utiliser que `id-color-storage` (P3)
- [ ] Stratégie de versions et CHANGELOG (P2)

---

## Découpage par releases (suggestion)

- P0 Release: Checkout + USDT (quote + statut) + Commande + Stock + CI/CD minimal + Sentry
- P1 Release: TVA/Livraison, Légal, SEO/Perf/A11y, Tests E2E
- P2 Release: Auth/Espace client, i18n, UX growth

---

## Notes d'implémentation

- Backend minimal: Node/Express (ou serverless) pour `orders`, `create-payment-intent`, webhooks.
- Secrets via variables d'environnement; ne jamais exposer les clés Stripe secrètes côté client.
- Idempotence: utiliser un `idempotencyKey` par tentative de commande.


