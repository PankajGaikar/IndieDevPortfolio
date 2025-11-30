# iOS Indie Dev Portfolio Showcaser — POC Tasks

> Goal: Paste an iOS app or developer App Store URL → generate a shareable portfolio image
> showing apps, total ratings, and "Trending in X countries" (if applicable).
> POC is 100% free, no login.

---

## ✅ Phase 1 – Project Setup (DONE)

- [x] Initialize Node.js project (TypeScript)
- [x] Install dependencies: express, puppeteer, axios, node-cache
- [x] Create base folder structure

---

## ✅ Phase 2 – URL Parsing & Utilities (DONE)

- [x] Implement `extractAppId(input: string)` - supports all URL formats + raw IDs
- [x] Implement `extractDeveloperId(input: string)` - derives from app if needed
- [x] Add reusable error types

---

## ✅ Phase 3 – Data Layer (DONE)

- [x] iTunes Lookup Client (`fetchAppById`, `fetchDeveloperApps`)
- [x] In-memory cache with 1-hour TTL
- [x] Apple Top Charts fetching (175 countries!)
- [x] **Worldwide rating aggregation** (sums ratings from all countries)

---

## ✅ Phase 4 – Core Portfolio Logic (DONE)

- [x] `buildDeveloperPortfolio()` with full stats
- [x] Top 8 apps display, sorted by ratings
- [x] Handle edge cases (0 ratings, no apps)
- [x] Portfolio-level + per-app trending detection

---

## ✅ Phase 5 – Card Template (DONE)

- [x] HTML/CSS template with dynamic data
- [x] 3 styles: Dark, Light, Minimal
- [x] 3 sizes: Landscape (1200x630), Story (1080x1920), Square (1080x1080)
- [x] Per-app rank badges
- [x] Trending country flags

---

## ✅ Phase 6 – Image Generation (DONE)

- [x] Puppeteer rendering at 2x for retina
- [x] Wait for app icons to load
- [x] Error handling for timeouts

---

## ✅ Phase 7 – API & Frontend (DONE)

- [x] `POST /api/generate` - returns PNG image
- [x] `POST /api/generate/json` - returns portfolio data
- [x] Frontend with style/size selectors
- [x] Loading states, download button

---

## ✅ Phase 8 – Global Features (DONE)

- [x] 175 country support for trending
- [x] 3 scan modes: quick (5), major (20), global (175)
- [x] Per-app trending badges on cards
- [x] **Worldwide rating aggregation** from all countries

---

## 🚀 What's Next?

### Option A: Test & Polish
- [ ] Test UI in browser (http://localhost:3000)
- [ ] Update card to show "Worldwide" vs "US" ratings
- [ ] Add progress indicator for global scan

### Option B: Deploy
- [ ] Deploy to Vercel/Railway/Render
- [ ] Add custom domain
- [ ] Add rate limiting for public use

### Option C: Performance
- [ ] Background job for global scan (websocket updates)
- [ ] Pre-cache popular developers
- [ ] Optimize worldwide rating fetching

### Option D: More Features
- [ ] "Flagship app" card type
- [ ] Historical trending data
- [ ] Share directly to Twitter/LinkedIn
