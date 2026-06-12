# StreamVault — Deployment Guide

Your app was already PWA-ready (manifest, icons, service worker config all in place).
This package adds deploy configs so frontend (Vercel) and backend (Render) work together.

## 1. Deploy the backend (Render)

1. Push the `backend/` folder to its own GitHub repo (or the whole project, Render can target a subdirectory).
2. On Render: New → Web Service → connect your repo.
3. Render will read `backend/render.yaml` automatically (Blueprint deploy), or set manually:
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Env vars: `PORT=5001`, `BASE_URL=https://allmovieland.link/player.js?v=60%20128`, `RATE_LIMIT=true`, `AWI_TIMEOUT_MS=15000`
4. After deploy, copy your backend URL, e.g. `https://streamvault-backend.onrender.com`

## 2. Deploy the frontend (Vercel)

1. Push `frontend/` to GitHub.
2. On Vercel: New Project → import the repo → framework preset "Vite".
3. Add environment variable:
   - `VITE_API_BASE` = `https://streamvault-backend.onrender.com` (your Render URL, no trailing slash)
4. Deploy.

## 3. Install as an app (Android Chrome)

1. Open your Vercel URL on Android Chrome.
2. Tap the ⋮ menu → "Add to Home screen" / "Install app".
3. The app installs with the StreamVault icon, opens full-screen (standalone), and the
   service worker caches the app shell for offline use. API calls (`/api/v1/*`) always go
   to the network (not cached), as configured in `vite.config.js`.

## What was changed

- `backend/index.ts`: removed invalid `credentials: true` + `origin: "*"` CORS combo
  (browsers reject that pairing; harmless here since no cookies are used).
- `backend/render.yaml`: replaced placeholder pointing to an external repo with a
  proper Node web service config for this backend.
- `frontend/vercel.json`: added SPA rewrite so client-side routes don't 404 on refresh.

## Notes

- Locally (`npm run dev`), the Vite proxy still forwards `/8api` and `/api/v1/awi` to
  `localhost:5001` — no changes needed for local dev.
- In production, `StreamVault.jsx` reads `VITE_API_BASE` to call your deployed backend directly.
