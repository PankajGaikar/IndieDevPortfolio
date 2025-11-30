# 📱 Indie Portfolio Showcaser

Generate beautiful, shareable portfolio cards for iOS indie developers. Paste an App Store URL and get a stunning image showcasing your apps, ratings, and global trending status.

![Portfolio Card Example](./docs/example-card.png)

## ✨ Features

- **Portfolio Stats** — Automatically aggregates total apps and combined ratings
- **Global Trending** — Shows if apps are trending in US, UK, India, Canada, or Australia (Top 200)
- **Shareable Design** — 1200×630 cards optimized for Twitter, LinkedIn, and Instagram
- **No Login Required** — 100% free, instant generation
- **Smart Caching** — 1-hour cache to respect Apple's rate limits

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repo
cd IndieDevPortfolio

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be running at **http://localhost:3000**

## 📖 API Reference

### Generate Portfolio Card

```http
POST /api/generate
Content-Type: application/json

{
  "input": "https://apps.apple.com/app/your-app/id123456789"
}
```

**Response:** PNG image (1200×630)

**Response Headers:**
- `X-Developer-Name` — Developer name
- `X-Total-Apps` — Number of apps
- `X-Total-Ratings` — Total ratings count
- `X-Generation-Time` — Time taken to generate

### Get Portfolio Data (JSON)

```http
POST /api/generate/json
Content-Type: application/json

{
  "input": "123456789"
}
```

**Response:**
```json
{
  "success": true,
  "portfolio": {
    "developer": { "id": "...", "name": "..." },
    "stats": { "totalApps": 5, "totalRatings": 12500, ... },
    "apps": [...],
    "trending": { "hasTrending": true, "countries": [...] }
  }
}
```

## 🔗 Supported URL Formats

- `https://apps.apple.com/app/id123456789`
- `https://apps.apple.com/us/app/app-name/id123456789`
- `https://apps.apple.com/developer/dev-name/id123456789`
- `https://itunes.apple.com/us/app/app-name/id123456789`
- Raw numeric ID: `123456789`

## 🏗️ Project Structure

```
indie-portfolio-showcaser/
├── src/
│   ├── api/
│   │   ├── itunesClient.ts      # iTunes Lookup API wrapper
│   │   └── chartsClient.ts      # Apple RSS top charts wrapper
│   ├── lib/
│   │   ├── extractAppId.ts      # URL parsing utility
│   │   ├── cache.ts             # In-memory cache with TTL
│   │   └── types.ts             # TypeScript interfaces
│   ├── core/
│   │   ├── portfolioService.ts  # Main portfolio builder
│   │   └── trendingService.ts   # Multi-country trending detection
│   ├── templates/
│   │   └── portfolioCard.html   # Card HTML/CSS template
│   ├── generator/
│   │   └── imageGenerator.ts    # Puppeteer screenshot logic
│   └── routes/
│       ├── generateRoute.ts     # POST /api/generate
│       └── index.ts             # Express app
├── public/
│   └── index.html               # Frontend UI
├── output/                      # Generated images (dev)
├── tasks.md                     # Implementation checklist
└── package.json
```

## 🎨 Card Template

The card template uses:
- **Size:** 1200×630 pixels (2x retina)
- **Font:** DM Sans (Google Fonts)
- **Layout:** 2×4 app icon grid (max 8 apps displayed)
- **Trending:** Secondary badge block (hidden if no trending)

## ⚙️ Configuration

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `PORT` | `3000` | Server port |

### Supported Countries (POC)

- 🇺🇸 United States
- 🇮🇳 India
- 🇬🇧 United Kingdom
- 🇨🇦 Canada
- 🇦🇺 Australia

### Cache TTL

All data is cached for **1 hour** (3600 seconds):
- iTunes app/developer data
- Top charts per country/chart type

## 🛣️ Roadmap

- [ ] Multiple card styles (dark, light, minimal, flex)
- [ ] Flagship app card variant
- [ ] Per-app trending badges (premium)
- [ ] Scan all 175+ countries (premium)
- [ ] User accounts & saved portfolios
- [ ] Custom branding / watermark removal

## 📄 License

MIT — Built for indie iOS developers ❤️

