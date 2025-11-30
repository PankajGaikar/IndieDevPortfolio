# iOS Indie Dev Portfolio Showcaser — POC Tasks

> Goal: Paste an iOS app or developer App Store URL → generate a shareable portfolio image
> showing apps, total ratings, and "Trending in X countries" (if applicable).
> POC is 100% free, no login.

---

## Phase 1 – Project Setup

- [x] Initialize Node.js project (TypeScript)
- [x] Install dependencies:
  - express (HTTP server)
  - puppeteer (HTML → image)
  - axios (HTTP calls)
  - node-cache (in-memory TTL cache)
- [x] Create base folder structure:
  - `src/api`, `src/lib`, `src/core`, `src/templates`, `src/generator`, `src/routes`
  - `public/`, `output/`

---

## Phase 2 – URL Parsing & Utilities

- [ ] Implement `extractAppId(input: string)`:
  - Support:
    - `https://apps.apple.com/app/id123456789`
    - `https://apps.apple.com/us/app/app-name/id123456789`
    - `https://itunes.apple.com/.../id123456789`
    - Raw ID: `123456789`
  - Return `{ appId, error? }`
- [ ] Implement `extractDeveloperId(input: string)`:
  - Support dev URLs like `https://apps.apple.com/developer/.../id123456789`
  - If only app URL is provided, derive `developerId` via iTunes Lookup
- [ ] Add reusable error type(s) for "invalid URL/ID", "developer not found", etc.

---

## Phase 3 – Data Layer (iTunes + Charts)

### 3.1 iTunes Lookup Client

- [ ] Implement `fetchAppById(appId)` using iTunes Lookup API
  - Extract `artistId`, `artistName`
- [ ] Implement `fetchDeveloperApps(developerId)`:
  - Use iTunes Lookup with `entity=software`
  - Map to internal type:
    - id, name, icon URL
    - average rating
    - rating count
- [ ] Handle API errors + empty result sets gracefully

### 3.2 Caching

- [ ] Implement a simple in-memory cache module:
  - `get(key)`, `set(key, value, ttlSeconds)`
- [ ] Cache:
  - iTunes app data per `developerId` for **1 hour**
  - Top charts data per `(country, chartType)` for **1 hour**

### 3.3 Apple Top Charts (Trending)

- [ ] Implement `fetchTopCharts(country, chartType)` using Apple RSS JSON feeds:
  - Countries (hardcoded for POC):
    - `US`, `IN`, `GB`, `CA`, `AU`
  - Chart types:
    - `top-free`
    - `top-paid`
  - Limit: top 200 apps
- [ ] Return a structure like `{ appId → rank }`
- [ ] Integrate caching so repeated calls reuse cached feeds

---

## Phase 4 – Core Portfolio Logic

- [ ] Implement `buildDeveloperPortfolio(inputUrlOrId)`:
  - Use `extractAppId` / `extractDeveloperId`
  - If app ID → fetch app → get `artistId`
  - Fetch all apps for `developerId`
- [ ] Compute portfolio stats:
  - Total number of apps
  - Total ratings = sum of rating counts (only where `ratingCount > 0`)
  - Sort apps by rating count descending
  - Limit to **top 8 apps** for display and compute `remainingCount`
- [ ] Handle edge cases:
  - If an app has `0` ratings:
    - Mark as `isNewApp = true` for display ("New App — No ratings yet")
  - If developer has no apps:
    - Return a clear error state

### 4.2 Trending Detection (Portfolio-Level Only)

- [ ] For the set of developer app IDs:
  - Check each app against cached top charts for:
    - Countries: US, IN, GB, CA, AU
  - Chart types: Top Free, Top Paid
- [ ] Build a portfolio-level summary:
  - `totalTrendingCountries`
  - For each country where any app appears, track best rank
- [ ] DO NOT expose per-app trending details in POC (only portfolio-level)
- [ ] If no apps are in top 200 in any of the 5 countries:
  - Mark `hasTrending = false` so the UI/card can hide the section

---

## Phase 5 – Card Template (HTML/CSS)

- [ ] Create a single HTML template: `templates/portfolioCard.html`
  - Inputs:
    - Developer name
    - App list (max 8 apps, with:
      - icon
      - name
      - rating (or "New App — No ratings yet")
    - Total apps count (`displayed + remaining`)
    - Total ratings
    - Trending summary:
      - If `hasTrending`:
        - Text like: "Trending in 3 countries"
        - List of country badges with short labels:
          - e.g., "🇺🇸 Top 80", "🇮🇳 Top 50"
      - If `!hasTrending`:
        - Hide trending block entirely
- [ ] Layout:
  - Landscape card suitable for Twitter/OG image:
    - ~1200 x 630
  - Clean, modern design:
    - One background gradient
    - App icons in a grid (2 rows max)
    - Footer with small "Generated with indie-portfolio.showcase" text

---

## Phase 6 – Image Generation (Puppeteer)

- [ ] Implement `generatePortfolioImage(portfolioData)`:
  - Render `portfolioCard.html` with dynamic data
  - Launch Puppeteer
  - Set viewport to card size (e.g. 1200x630)
  - Wait for images (app icons) to load
  - Screenshot only the card container element
  - Save to `/output` locally in dev; return buffer/stream in prod
- [ ] Handle Puppeteer failures:
  - Timeouts
  - Render errors
  - Return a clear error to the client

---

## Phase 7 – HTTP API & Simple Frontend

### 7.1 API

- [ ] Implement `POST /api/generate`:
  - Body: `{ "input": "<app-or-developer-url-or-id>" }`
  - Validate input
  - Call `buildDeveloperPortfolio`
  - Call `generatePortfolioImage`
  - Respond with:
    - Image as `image/png` OR
    - JSON with a temporary image URL

### 7.2 Frontend

- [ ] Create minimal `public/index.html`:
  - Text input for URL / ID
  - "Generate card" button
  - Area to display:
    - Loading state
    - Generated image
    - "Download" button
- [ ] Hook frontend to `POST /api/generate` using fetch()

---

## Phase 8 – Polish & Testing

- [ ] Test with:
  - Developers with many apps (30+)
  - Developers with 1–2 apps
  - Apps with 0 ratings
- [ ] Verify:
  - Caching works (logs / timings)
  - Trending block behavior:
    - Shows up when there is trending
    - Completely hidden when there is none
- [ ] Add basic logging for:
  - Incoming requests
  - iTunes/charts fetches (cache hit/miss)
  - Puppeteer generation time

