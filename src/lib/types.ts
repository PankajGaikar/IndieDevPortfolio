// ============================================================
// iOS Indie Dev Portfolio Showcaser — Type Definitions
// ============================================================

// --------------------------
// App Store URL Parsing
// --------------------------

export interface ParsedId {
  id: string;
  type: 'app' | 'developer';
}

export interface ParseResult {
  success: true;
  data: ParsedId;
}

export interface ParseError {
  success: false;
  error: string;
}

export type ParseIdResult = ParseResult | ParseError;

// --------------------------
// iTunes API Response Types
// --------------------------

export interface iTunesApp {
  trackId: number;
  trackName: string;
  artworkUrl512: string;       // High-res icon
  artworkUrl100: string;       // Fallback icon
  averageUserRating: number;   // 0-5 stars
  userRatingCount: number;     // Total number of ratings
  artistId: number;            // Developer ID
  artistName: string;          // Developer name
  primaryGenreName: string;    // e.g., "Games", "Utilities"
  price: number;               // 0 for free apps
  formattedPrice: string;      // "$0.00" or "Free"
  bundleId: string;            // com.developer.appname
}

export interface iTunesLookupResponse {
  resultCount: number;
  results: iTunesApp[];
}

// --------------------------
// Processed App (Internal)
// --------------------------

export interface PortfolioApp {
  id: string;                  // App Store ID as string
  name: string;
  iconUrl: string;
  rating: number;              // 0-5, rounded to 1 decimal
  ratingCount: number;         // Country-specific (usually US)
  worldwideRatingCount?: number; // Aggregated from all countries (only with global scan)
  isNewApp: boolean;           // true if ratingCount === 0
  isFree: boolean;
}

// --------------------------
// Trending Data
// --------------------------

export type ChartType = 'top-free' | 'top-paid';
export const CHART_TYPES: ChartType[] = ['top-free', 'top-paid'];

// Scan modes
export type ScanMode = 'quick' | 'major' | 'global';

export interface TrendingCountry {
  countryCode: string;
  flag: string;                // e.g., "🇺🇸"
  countryName: string;         // e.g., "United States"
  bestRank: number;            // Best rank among all apps in this country
  chartType: ChartType;        // Which chart (top-free or top-paid)
}

export interface AppTrendingInfo {
  appId: string;
  appName: string;
  rating: number;                      // App rating (0-5)
  ratingCount: number;                 // Country-specific ratings (usually US)
  worldwideRatingCount?: number;       // Aggregated ratings from all countries
  trendingIn: TrendingCountry[];       // Countries where this app is ranked
  bestGlobalRank: number | null;       // Best rank across all countries
  bestCountry: string | null;          // Country with best rank
}

export interface TrendingSummary {
  hasTrending: boolean;
  totalTrendingCountries: number;
  countries: TrendingCountry[];      // Portfolio-level: best rank per country
  perAppTrending: AppTrendingInfo[]; // Per-app trending data
  scanMode: ScanMode;
  countriesScanned: number;
}

// --------------------------
// Portfolio Data (Main Shape)
// --------------------------

/**
 * This is the main data structure passed to the card template.
 * It contains everything needed to render the portfolio card.
 */
export interface PortfolioData {
  // Developer info
  developer: {
    id: string;
    name: string;
  };

  // App statistics
  stats: {
    totalApps: number;           // Total apps by this developer
    displayedApps: number;       // Apps shown on card (max 8)
    remainingApps: number;       // totalApps - displayedApps
    totalRatings: number;        // Sum of all rating counts
  };

  // Apps to display (max 8, sorted by ratingCount desc)
  apps: PortfolioApp[];

  // Trending summary (portfolio-level only)
  trending: TrendingSummary;

  // Metadata
  generatedAt: string;           // ISO timestamp
}

// --------------------------
// Charts API Types
// --------------------------

export interface ChartEntry {
  appId: string;
  rank: number;
}

export interface ChartData {
  country: string;
  chartType: ChartType;
  entries: Map<string, number>;  // appId → rank
  fetchedAt: Date;
}

// --------------------------
// API Response Types
// --------------------------

export interface GenerateRequest {
  input: string;      // App URL, Developer URL, or raw ID
  style?: CardStyle;  // Card style: dark, light, minimal
  size?: CardSize;    // Card size: landscape, story, square
  scanMode?: ScanMode; // Trending scan: quick (5), major (20), global (175)
}

export interface GenerateSuccessResponse {
  success: true;
  imageUrl: string;
  portfolio: PortfolioData;
}

export interface GenerateErrorResponse {
  success: false;
  error: string;
  code: 'INVALID_INPUT' | 'DEVELOPER_NOT_FOUND' | 'NO_APPS' | 'GENERATION_FAILED';
}

export type GenerateResponse = GenerateSuccessResponse | GenerateErrorResponse;

// --------------------------
// Cache Keys
// --------------------------

export const CacheKeys = {
  developerApps: (developerId: string) => `dev:${developerId}`,
  appLookup: (appId: string) => `app:${appId}`,
  chart: (country: string, chartType: ChartType) => `chart:${country}:${chartType}`,
} as const;

// Cache TTL in seconds (1 hour)
export const CACHE_TTL_SECONDS = 3600;

// --------------------------
// Display Constants
// --------------------------

export const MAX_DISPLAYED_APPS = 8;
export const TOP_CHART_LIMIT = 200;

// --------------------------
// Card Styles
// --------------------------

export type CardStyle = 'dark' | 'light' | 'minimal';
export type CardSize = 'landscape' | 'story' | 'square';

export const CARD_STYLES: CardStyle[] = ['dark', 'light', 'minimal'];

export const CARD_DIMENSIONS: Record<CardSize, { width: number; height: number }> = {
  landscape: { width: 1200, height: 630 },  // Twitter/OG
  story: { width: 1080, height: 1920 },     // Instagram Story
  square: { width: 1080, height: 1080 },    // Instagram Feed
};

