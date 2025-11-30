import axios from 'axios';
import { cache } from '../lib/cache';
import {
  CountryCode,
  ChartType,
  CacheKeys,
  CACHE_TTL_SECONDS,
  TOP_CHART_LIMIT,
  SUPPORTED_COUNTRIES,
  CHART_TYPES,
} from '../lib/types';

const APPLE_RSS_BASE = 'https://rss.marketingtools.apple.com/api/v2';

interface AppleRSSApp {
  id: string;
  name: string;
  url: string;
}

interface AppleRSSFeed {
  feed: {
    results: AppleRSSApp[];
  };
}

/**
 * Fetch top charts for a specific country and chart type
 * Returns a Map of appId -> rank
 */
export async function fetchTopCharts(
  country: CountryCode,
  chartType: ChartType
): Promise<Map<string, number>> {
  const cacheKey = CacheKeys.chart(country, chartType);
  
  return cache.getOrSet(cacheKey, async () => {
    console.log(`[Charts] Fetching ${chartType} for ${country}`);
    
    try {
      // Apple RSS feed URL format
      // Example: https://rss.applemarketingtools.com/api/v2/us/apps/top-free/200/apps.json
      const url = `${APPLE_RSS_BASE}/${country.toLowerCase()}/apps/${chartType}/${TOP_CHART_LIMIT}/apps.json`;
      
      const response = await axios.get<AppleRSSFeed>(url, {
        timeout: 10000,
      });

      const chartMap = new Map<string, number>();
      
      response.data.feed.results.forEach((app, index) => {
        // Rank is 1-indexed
        chartMap.set(app.id, index + 1);
      });

      console.log(`[Charts] Got ${chartMap.size} apps for ${country}/${chartType}`);
      return chartMap;
    } catch (error) {
      console.error(`[Charts] Error fetching ${country}/${chartType}:`, error);
      // Return empty map on error - don't fail the whole request
      return new Map<string, number>();
    }
  }, CACHE_TTL_SECONDS);
}

/**
 * Check if an app appears in any top chart for a given country
 * Returns the best (lowest) rank if found, null otherwise
 */
export async function getAppRankInCountry(
  appId: string,
  country: CountryCode
): Promise<{ rank: number; chartType: ChartType } | null> {
  let bestRank: number | null = null;
  let bestChartType: ChartType | null = null;

  for (const chartType of CHART_TYPES) {
    const chart = await fetchTopCharts(country, chartType);
    const rank = chart.get(appId);
    
    if (rank !== undefined && (bestRank === null || rank < bestRank)) {
      bestRank = rank;
      bestChartType = chartType;
    }
  }

  if (bestRank !== null && bestChartType !== null) {
    return { rank: bestRank, chartType: bestChartType };
  }

  return null;
}

/**
 * Check multiple apps against all supported countries
 * Returns trending data for portfolio-level summary
 */
export async function checkTrendingForApps(
  appIds: string[]
): Promise<Map<CountryCode, { bestRank: number; chartType: ChartType }>> {
  const trendingByCountry = new Map<CountryCode, { bestRank: number; chartType: ChartType }>();

  // For each country, check all apps and find the best ranking one
  for (const country of SUPPORTED_COUNTRIES) {
    let countryBestRank: number | null = null;
    let countryBestChartType: ChartType | null = null;

    for (const chartType of CHART_TYPES) {
      const chart = await fetchTopCharts(country, chartType);
      
      for (const appId of appIds) {
        const rank = chart.get(appId);
        if (rank !== undefined && (countryBestRank === null || rank < countryBestRank)) {
          countryBestRank = rank;
          countryBestChartType = chartType;
        }
      }
    }

    if (countryBestRank !== null && countryBestChartType !== null) {
      trendingByCountry.set(country, {
        bestRank: countryBestRank,
        chartType: countryBestChartType,
      });
    }
  }

  return trendingByCountry;
}

/**
 * Prefetch all charts data (useful for warming cache)
 */
export async function prefetchAllCharts(): Promise<void> {
  console.log('[Charts] Prefetching all charts data...');
  
  const promises: Promise<Map<string, number>>[] = [];
  
  for (const country of SUPPORTED_COUNTRIES) {
    for (const chartType of CHART_TYPES) {
      promises.push(fetchTopCharts(country, chartType));
    }
  }

  await Promise.all(promises);
  console.log('[Charts] Prefetch complete');
}

