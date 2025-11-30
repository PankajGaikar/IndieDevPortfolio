import { checkTrendingForApps, getCountriesForScanMode } from '../api/chartsClient';
import {
  TrendingSummary,
  TrendingCountry,
  AppTrendingInfo,
  ChartType,
  ScanMode,
  PortfolioApp,
} from '../lib/types';
import { getCountryInfo, getCountryFlag, getCountryName } from '../lib/countries';

/**
 * Build a complete trending summary from a list of apps.
 * 
 * Supports three scan modes:
 * - quick: 5 countries (US, IN, GB, CA, AU) - fastest
 * - major: 20 major markets - balanced
 * - global: All 175 countries - comprehensive
 */
export async function buildTrendingSummary(
  apps: PortfolioApp[],
  scanMode: ScanMode = 'quick'
): Promise<TrendingSummary> {
  const appIds = apps.map(app => app.id);
  console.log(`[Trending] Checking ${appIds.length} apps in ${scanMode} mode`);

  if (appIds.length === 0) {
    return {
      hasTrending: false,
      totalTrendingCountries: 0,
      countries: [],
      perAppTrending: [],
      scanMode,
      countriesScanned: 0,
    };
  }

  // Get trending data from charts
  const { perApp, perCountry, countriesScanned } = await checkTrendingForApps(appIds, scanMode);

  // Build portfolio-level country summary
  const countries: TrendingCountry[] = [];
  
  perCountry.forEach((data, countryCode) => {
    countries.push({
      countryCode,
      flag: getCountryFlag(countryCode),
      countryName: getCountryName(countryCode),
      bestRank: data.bestRank,
      chartType: data.chartType,
    });
  });

  // Sort by best rank (ascending - lower rank is better)
  countries.sort((a, b) => a.bestRank - b.bestRank);

  // Build per-app trending info
  const perAppTrending: AppTrendingInfo[] = [];
  
  for (const app of apps) {
    const appTrendingData = perApp.get(app.id) || [];
    
    if (appTrendingData.length > 0) {
      // Sort by rank to find best
      appTrendingData.sort((a, b) => a.rank - b.rank);
      const best = appTrendingData[0];

      // Convert to TrendingCountry format
      const trendingIn: TrendingCountry[] = appTrendingData.map(t => ({
        countryCode: t.country,
        flag: getCountryFlag(t.country),
        countryName: getCountryName(t.country),
        bestRank: t.rank,
        chartType: t.chartType,
      }));

      perAppTrending.push({
        appId: app.id,
        appName: app.name,
        rating: app.rating,
        ratingCount: app.ratingCount,
        worldwideRatingCount: app.worldwideRatingCount,
        trendingIn,
        bestGlobalRank: best.rank,
        bestCountry: best.country,
      });
    }
  }

  // Sort apps by number of countries trending in (descending)
  perAppTrending.sort((a, b) => b.trendingIn.length - a.trendingIn.length);

  console.log(`[Trending] Found ${countries.length} countries, ${perAppTrending.length} apps trending`);

  return {
    hasTrending: countries.length > 0,
    totalTrendingCountries: countries.length,
    countries,
    perAppTrending,
    scanMode,
    countriesScanned,
  };
}

/**
 * Format chart type for display
 */
export function formatChartType(chartType: ChartType): string {
  switch (chartType) {
    case 'top-free':
      return 'Free';
    case 'top-paid':
      return 'Paid';
    default:
      return chartType;
  }
}

/**
 * Get a compact trending description for an app
 */
export function getAppTrendingDescription(appTrending: AppTrendingInfo): string {
  if (appTrending.trendingIn.length === 0) {
    return '';
  }

  const count = appTrending.trendingIn.length;
  const best = appTrending.trendingIn[0];
  
  if (count === 1) {
    return `#${best.bestRank} in ${best.countryName}`;
  }

  return `#${best.bestRank} in ${best.countryName} +${count - 1} more`;
}

/**
 * Get trending headline text
 */
export function getTrendingHeadline(summary: TrendingSummary): string {
  if (!summary.hasTrending) {
    return '';
  }

  const { totalTrendingCountries, scanMode, countriesScanned } = summary;
  const countryWord = totalTrendingCountries === 1 ? 'country' : 'countries';
  
  if (scanMode === 'global') {
    return `Trending in ${totalTrendingCountries} ${countryWord} (of ${countriesScanned} scanned)`;
  }
  
  return `Trending in ${totalTrendingCountries} ${countryWord}`;
}
