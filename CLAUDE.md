# Affittochiaro

Italian property rental platform — tenant CV/profile system + agency dashboard.

## Commands
```bash
npm run dev      # dev server port 3000
npm run build    # production build
npx tsc --noEmit # always run before commit
```

## Deploy Rule (CRITICAL)
Always work on `main`, push to `main` → Vercel auto-deploys.
Flow: edit → `tsc --noEmit` → commit → `git push origin main`

## Global Rules
- Fonts: **Inter + Roboto only** — never Mulish, Poppins, Lora
- Icons: **lucide-react only** — never emoji in JSX/TSX
- No `font-poppins` class anywhere
- Confirm before `git push --force`, dropping tables, or destructive ops

## Environment
- `VITE_USE_MOCK_API=false` → real AWS backend
- `VITE_USE_MOCK_API` unset/any → mock data
