## AffittoChiaro – Frontend

Applicazione frontend di **AffittoChiaro**, sviluppata con **React**, **Vite** e **Tailwind CSS**.

### Requisiti

- **Node.js** 20 o superiore
- **npm** (incluso con Node)

### Installazione e avvio in locale

1. **Installa le dipendenze**

   ```bash
   npm install
   ```

2. **Configura le variabili d’ambiente**

   - Copia il file `.env.example` in `.env.local`:

     ```bash
     cp .env.example .env.local
     ```

   - Compila i valori necessari, in particolare:
     - `VITE_API_URL`, `VITE_COGNITO_USER_POOL_ID`, `VITE_COGNITO_CLIENT_ID`
     - chiavi Stripe (`VITE_STRIPE_PUBLIC_KEY`, ecc.)
     - eventuali URL WebSocket e altri servizi
   - **Non** committare mai file `.env*` con chiavi reali nel repository.

3. **Avvia il server di sviluppo**

   ```bash
   npm run dev
   ```

   L’app sarà disponibile all’indirizzo indicato da Vite (di solito `http://localhost:5173`).

### Build e preview

- **Build di produzione**

  ```bash
  npm run build
  ```

- **Preview della build**

  ```bash
  npm run preview
  ```

### Gestione progetto Vercel (opzionale)

Sono disponibili due script Node per gestire lo stato del progetto su Vercel:

- `pause-project.mjs` – mette in **pausa** il progetto
- `resume-project.mjs` – **riattiva** il progetto

Per usarli:

1. Imposta il token Vercel (mai committarlo in Git):

   ```powershell
   $env:VERCEL_TOKEN = "IL_TUO_TOKEN_VERCEL"
   ```

2. Esegui lo script desiderato:

   ```powershell
   node .\pause-project.mjs
   # oppure
   node .\resume-project.mjs
   ```

Assicurati di avere nel codice lo `projectId` corretto e, se necessario, il `teamID`.
