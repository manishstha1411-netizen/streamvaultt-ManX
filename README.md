# StreamVault + Hindi Dub

Movies · TV Shows · AniList Anime · **🇮🇳 Hindi Dubbed Anime** (AnimeWorld India)

---

## Run locally (Windows — PowerShell, 2 steps)

### Prerequisites
- **Node.js 18+** — download from https://nodejs.org (click the LTS button)
- That's it. No PHP, no XAMPP, no extra installs.

### Step 1 — Open PowerShell in this folder
Right-click inside the `streamvault-hindi` folder → **"Open in Terminal"**
(or press `Win + X` → "Windows PowerShell")

If you get a script-execution error, run this once first:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### Step 2 — Run the start script
```powershell
.\start.ps1
```

That's it. The script will:
1. Check for Node.js
2. Install all npm packages (first run only, ~1 min)
3. Open two terminal windows (backend + frontend)
4. Launch http://localhost:5173 in your browser

---

## 📱 Install on your phone (as an app)

StreamVault is a **PWA (Progressive Web App)** — once it's running, your phone
can install it like a real app, with its own icon and full-screen window.

### Step 1 — Start the app on your PC
Run `.\start.ps1` as usual. When it's ready, the terminal will show two URLs:
```
On THIS PC:
  http://localhost:5173

On your PHONE (same Wi-Fi):
  http://192.168.x.x:5173
```

> Make sure your phone is on the **same Wi-Fi network** as your PC.
> If Windows Firewall pops up asking about Node.js, click **Allow**.

### Step 2 — Open that IP address on your phone
Open Chrome (Android) or Safari (iPhone) and type in the `http://192.168.x.x:5173`
address shown in the terminal.

### Step 3 — Add to Home Screen

**Android (Chrome):**
1. Tap the **⋮** menu (top right)
2. Tap **"Add to Home screen"** / **"Install app"**
3. Confirm — StreamVault now appears as an app icon

**iPhone (Safari):**
1. Tap the **Share** icon (square with arrow)
2. Scroll down and tap **"Add to Home Screen"**
3. Tap **Add** — StreamVault now appears as an app icon

Once installed, it opens full-screen with no browser bar — just like a native app.

> ⚠️ Your PC must stay on and running `start.ps1` for the app to work on your
> phone, since the phone connects to your PC over the local network. For a
> version that works without your PC running, see **Deploy to production** below.

---

## Manual start (if you prefer)
```powershell
# Terminal 1 — backend
cd backend
npm run dev

# Terminal 2 — frontend (after backend starts)
cd frontend
npm run dev
```

---

## Using the Hindi Dub tab

1. Go to the **Anime** section (home page row or search for anime)
2. Tap any anime to open its detail page
3. Tap the **🇮🇳 Hindi Dub** tab
4. The app automatically searches AnimeWorld India for a Hindi dub match
5. Pick the right title → pick a season → pick an episode → watch

> ⚠️ **Caveat:** The Hindi Dub source scrapes `animeworld-india.me` in real-time.
> It may stop working if that site changes its HTML structure.
> This is an unofficial, community source — use it as a supplementary option
> alongside the main AniList-based streams.

---

## How the Hindi Dub backend works

No PHP required. The scraping is done inside the existing Express/TypeScript backend:

```
backend/
  controllers/
    awiScraper.ts   ← Node + cheerio scraper (replaces the PHP files)
  routes/
    route.ts        ← /api/v1/awi/* endpoints registered here
```

The frontend hits `/api/v1/awi/*` which Vite proxies to `localhost:5001` in dev.

**Available backend endpoints:**
| Endpoint | Query params | Description |
|---|---|---|
| `GET /api/v1/awi/home` | — | Latest series + movies |
| `GET /api/v1/awi/search` | `query`, `p` | Search Hindi dub catalog |
| `GET /api/v1/awi/seasons` | `seriesID` | Season list for a series slug |
| `GET /api/v1/awi/episodes` | `seasonId` | Episode list for a season slug |
| `GET /api/v1/awi/stream` | `episodeId` OR `movieId` | Stream iframe URL |
| `GET /api/v1/awi/a2z` | `letter`, `p` | Browse A–Z |

---

## Project structure
```
streamvault-hindi/
├── start.ps1              ← Windows one-click launcher
├── package.json           ← Root: one install, one dev command
├── frontend/
│   ├── src/
│   │   └── StreamVault.jsx  ← Full app + HindiDubTab component
│   ├── vite.config.js       ← Vite dev proxy (8api + awi)
│   └── .env                 ← VITE_API_BASE (blank = use proxy)
└── backend/
    ├── controllers/
    │   ├── awiScraper.ts    ← AnimeWorld India scraper (NEW)
    │   ├── getStream.ts
    │   ├── getSeasonList.ts
    │   └── mediaInfo.ts
    ├── routes/route.ts      ← All routes including /awi/*
    └── .env                 ← PORT, BASE_URL, AWI_TIMEOUT_MS
```

---

## Deploy to production

### Backend (Render / Railway / any Node host)
1. Push to GitHub
2. Create a new Web Service, root dir: `backend/`
3. Build command: `npm run build`
4. Start command: `npm start`
5. Set env vars: `PORT`, `BASE_URL`, `RATE_LIMIT`, `AWI_TIMEOUT_MS`

### Frontend (Vercel / Netlify)
1. Root dir: `frontend/`
2. Build command: `npm run build`
3. Output dir: `dist/`
4. Set env var: `VITE_API_BASE=https://your-deployed-backend.onrender.com`

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `start.ps1` blocked by execution policy | Run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` |
| Port 5001 already in use | Edit `backend/.env`, change `PORT=5001` to another port, update `vite.config.js` target |
| Hindi Dub tab shows "AWI backend 502" | The animeworld-india.me site may be down or changed — try again later |
| Hindi Dub shows "no results" | The title search didn't match — the tab shows all results so you can pick manually |
| `node` not found after installing | Restart PowerShell / your terminal after Node.js installation |
