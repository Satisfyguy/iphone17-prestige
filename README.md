# Welcome to your Lovable project

## Exploitation — V1 Paiement USDT (manuel)

### Variables d’environnement
- `WALLET_TRC20` : adresse TRON (USDT TRC-20)
- `WALLET_ERC20` : adresse Ethereum (USDT ERC-20)
- `WALLET_BEP20` : adresse BSC (USDT BEP-20)
- `ADMIN_TOKEN` : jeton admin pour confirmer un paiement (défaut dev: `dev_admin_token`)
- `SQLITE_PATH` (optionnel) : chemin du fichier SQLite (défaut `./data.db`)

### Lancer en local
```bash
pnpm dev:server   # backend (Express) — http://localhost:5175
pnpm dev          # frontend (Vite)   — http://localhost:5173
pnpm dev:all      # les deux en parallèle
```

### Endpoints backend (manuel)
- `POST /api/payment/quote`
  - body: `{ currency: "EUR", amount: number, network: "TRC-20"|"ERC-20"|"BEP-20" }`
  - renvoie: `{ quoteId, amountUSDT, network, address, expiresAt }`
- `GET /api/payment/status/:quoteId` → `{ status: pending|submitted|confirmed|expired, txHash?, confirmations? }`
- `POST /api/payment/submit-tx` (client)
  - body: `{ quoteId, txHash }` → positionne `submitted`
- `POST /api/payment/admin/confirm` (admin)
  - body: `{ token: ADMIN_TOKEN, quoteId }` → positionne `confirmed`
- `GET /api/payment/admin/confirm?token=ADMIN_TOKEN&quoteId=...` (admin simplifié)
  - confirme directement (réponse: `confirmed <quoteId>`)
- `POST /api/orders`
  - body: `{ quoteId }` (nécessite `confirmed`) → crée `{ orderId }`

### Parcours de test (E2E rapide)
1) Front: Aller au panier puis `Checkout`. Choisir un réseau et cliquer “Générer le devis USDT”.
2) Copier l’adresse et le montant (boutons fournis) ou scanner le QR.
3) Coller un hash de transaction fictif et cliquer “Soumettre la transaction”. Le statut passe à `submitted`.
4) Admin: Ouvrir `http://localhost:5175/api/payment/admin/confirm?token=ADMIN_TOKEN&quoteId=<QUOTE>` pour confirmer.
5) Front: Le statut passe à `confirmed` (polling). Cliquer “Finaliser la commande” → redirection `/success?orderId=...&txHash=...&network=...`.

### Persistance
- SQLite via `better-sqlite3` → tables `quotes` et `orders` créées automatiquement dans `server/db.ts`.
- Fichier DB par défaut: `./data.db` (configurable par `SQLITE_PATH`).

### Notes
- Le QR encode actuellement `tron:<address>?amount=<amount>` pour TRC‑20. Pour ERC‑20/BEP‑20, le payload est l’adresse (format EIP‑681 token non implémenté).
- Le statut est manuel: `submitted` après envoi du hash par le client, puis `confirmed` après action admin.

## Project info

**URL**: https://lovable.dev/projects/cf87b206-3b52-4ffb-9ed8-3f71f5b521c0

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/cf87b206-3b52-4ffb-9ed8-3f71f5b521c0) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/cf87b206-3b52-4ffb-9ed8-3f71f5b521c0) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
