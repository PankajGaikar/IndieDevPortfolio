import axios from 'axios';
import { cache } from '../lib/cache';
import {
  ChartType,
  CacheKeys,
  CACHE_TTL_SECONDS,
  TOP_CHART_LIMIT,
  CHART_TYPES,
  ScanMode,
} from '../lib/types';
import { ALL_COUNTRY_CODES, DEFAULT_COUNTRIES, MAJOR_MARKETS } from '../lib/countries';

// Legacy iTunes RSS feed - more reliable than the new marketing tools API
const ITUNES_RSS_BASE = 'https://itunes.apple.com';

// Map chart types to iTunes RSS feed names
const CHART_TYPE_MAP: Record<ChartType, string> = {
  'top-free': 'topfreeapplications',
  'top-paid': 'toppaidapplications',
};

// Concurrency settings for parallel requests
const MAX_CONCURRENT_REQUESTS = 10;
const REQUEST_DELAY_MS = 100; // Small delay between batches

// iTunes RSS feed response structure
interface iTunesRSSEntry {
  'im:name': { label: string };
  id: {
    label: string;
    attributes: {
      'im:id': string;
      'im:bundleId': string;
    };
  };
}

interface iTunesRSSFeed {
  feed: {
    entry: iTunesRSSEntry[];
  };
}

/**
 * Get countries to scan based on scan mode
 */
export function getCountriesForScanMode(mode: ScanMode): string[] {
  switch (mode) {
    case 'quick':
      return DEFAULT_COUNTRIES;
    case 'major':
      return MAJOR_MARKETS;
    case 'global':
      return ALL_COUNTRY_CODES;
    default:
      return DEFAULT_COUNTRIES;
  }
}

/**
 * Fetch top charts for a specific country and chart type
 * Uses the legacy iTunes RSS feed which is more reliable
 * Returns a Map of appId -> rank
 */
export async function fetchTopCharts(
  country: string,
  chartType: ChartType
): Promise<Map<string, number>> {
  const cacheKey = CacheKeys.chart(country, chartType);
  
  return cache.getOrSet(cacheKey, async () => {
    try {
      // iTunes RSS feed URL format
      const feedName = CHART_TYPE_MAP[chartType];
      const url = `${ITUNES_RSS_BASE}/${country.toLowerCase()}/rss/${feedName}/limit=${TOP_CHART_LIMIT}/json`;
      
      const response = await axios.get<iTunesRSSFeed>(url, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
        },
      });

      const chartMap = new Map<string, number>();
      
      const entries = response.data?.feed?.entry || [];
      entries.forEach((entry, index) => {
        const appId = entry.id?.attributes?.['im:id'];
        if (appId) {
          chartMap.set(appId, index + 1);
        }
      });

      return chartMap;
    } catch (error) {
      // Return empty map on error - don't fail the whole request
      return new Map<string, number>();
    }
  }, CACHE_TTL_SECONDS);
}

/**
 * Delay helper for rate limiting
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch charts for multiple countries in parallel with rate limiting
 */
export async function fetchChartsForCountries(
  countries: string[],
  chartTypes: ChartType[] = CHART_TYPES,
  onProgress?: (completed: number, total: number) => void
): Promise<Map<string, Map<string, number>>> {
  const results = new Map<string, Map<string, number>>();
  const tasks: { country: string; chartType: ChartType }[] = [];

  // Build list of all tasks
  for (const country of countries) {
    for (const chartType of chartTypes) {
      tasks.push({ country, chartType });
    }
  }

  const total = tasks.length;
  let completed = 0;

  // Process in batches
  for (let i = 0; i < tasks.length; i += MAX_CONCURRENT_REQUESTS) {
    const batch = tasks.slice(i, i + MAX_CONCURRENT_REQUESTS);
    
    const batchPromises = batch.map(async ({ country, chartType }) => {
      const chart = await fetchTopCharts(country, chartType);
      const key = `${country}:${chartType}`;
      results.set(key, chart);
      completed++;
      if (onProgress) {
        onProgress(completed, total);
      }
    });

    await Promise.all(batchPromises);
    
    // Small delay between batches to avoid rate limiting
    if (i + MAX_CONCURRENT_REQUESTS < tasks.length) {
      await delay(REQUEST_DELAY_MS);
    }
  }

  return results;
}

/**
 * Check multiple apps against charts for specified countries
 * Returns per-app and portfolio-level trending data
 */
export async function checkTrendingForApps(
  appIds: string[],
  scanMode: ScanMode = 'quick'
): Promise<{
  perApp: Map<string, { country: string; chartType: ChartType; rank: number }[]>;
  perCountry: Map<string, { bestRank: number; chartType: ChartType; appId: string }>;
  countriesScanned: number;
}> {
  const countries = getCountriesForScanMode(scanMode);
  console.log(`[Charts] Scanning ${countries.length} countries (${scanMode} mode) for ${appIds.length} apps`);

  const perApp = new Map<string, { country: string; chartType: ChartType; rank: number }[]>();
  const perCountry = new Map<string, { bestRank: number; chartType: ChartType; appId: string }>();

  // Initialize per-app map
  for (const appId of appIds) {
    perApp.set(appId, []);
  }

  // Fetch all charts
  const chartsData = await fetchChartsForCountries(countries, CHART_TYPES);

  // Process results
  for (const country of countries) {
    for (const chartType of CHART_TYPES) {
      const key = `${country}:${chartType}`;
      const chart = chartsData.get(key);
      if (!chart || chart.size === 0) continue;

      for (const appId of appIds) {
        const rank = chart.get(appId);
        if (rank !== undefined) {
          // Add to per-app data
          const appTrending = perApp.get(appId) || [];
          appTrending.push({ country, chartType, rank });
          perApp.set(appId, appTrending);

          // Update per-country best rank
          const existing = perCountry.get(country);
          if (!existing || rank < existing.bestRank) {
            perCountry.set(country, { bestRank: rank, chartType, appId });
          }
        }
      }
    }
  }

  console.log(`[Charts] Found trending in ${perCountry.size} countries`);

  return {
    perApp,
    perCountry,
    countriesScanned: countries.length,
  };
}

/**
 * Prefetch charts data for warming cache
 */
export async function prefetchAllCharts(scanMode: ScanMode = 'quick'): Promise<void> {
  const countries = getCountriesForScanMode(scanMode);
  console.log(`[Charts] Prefetching charts for ${countries.length} countries...`);
  
  await fetchChartsForCountries(countries, CHART_TYPES, (completed, total) => {
    if (completed % 20 === 0 || completed === total) {
      console.log(`[Charts] Prefetch progress: ${completed}/${total}`);
    }
  });
  
  console.log('[Charts] Prefetch complete');
}
