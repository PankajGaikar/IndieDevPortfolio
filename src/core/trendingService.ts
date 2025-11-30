import { checkTrendingForApps } from '../api/chartsClient';
import {
  TrendingSummary,
  TrendingCountry,
  CountryCode,
  ChartType,
  COUNTRY_FLAGS,
  COUNTRY_NAMES,
} from '../lib/types';

/**
 * Build a portfolio-level trending summary from a list of app IDs.
 * 
 * This checks all apps against all supported countries (US, IN, GB, CA, AU)
 * and both chart types (top-free, top-paid).
 * 
 * Returns a summary with:
 * - Whether any apps are trending
 * - Total number of countries where apps are trending
 * - Details for each country (best rank among all apps)
 */
export async function buildTrendingSummary(appIds: string[]): Promise<TrendingSummary> {
  console.log(`[Trending] Checking ${appIds.length} apps for trending status`);

  if (appIds.length === 0) {
    return {
      hasTrending: false,
      totalTrendingCountries: 0,
      countries: [],
    };
  }

  // Get trending data for all apps across all countries
  const trendingByCountry = await checkTrendingForApps(appIds);

  if (trendingByCountry.size === 0) {
    console.log('[Trending] No apps are trending in any country');
    return {
      hasTrending: false,
      totalTrendingCountries: 0,
      countries: [],
    };
  }

  // Convert to TrendingCountry array
  const countries: TrendingCountry[] = [];
  
  trendingByCountry.forEach((data, countryCode) => {
    countries.push({
      countryCode,
      flag: COUNTRY_FLAGS[countryCode],
      countryName: COUNTRY_NAMES[countryCode],
      bestRank: data.bestRank,
      chartType: data.chartType,
    });
  });

  // Sort by best rank (ascending - lower rank is better)
  countries.sort((a, b) => a.bestRank - b.bestRank);

  console.log(`[Trending] Found trending in ${countries.length} countries`);

  return {
    hasTrending: true,
    totalTrendingCountries: countries.length,
    countries,
  };
}

/**
 * Format chart type for display
 */
export function formatChartType(chartType: ChartType): string {
  switch (chartType) {
    case 'top-free':
      return 'Top Free';
    case 'top-paid':
      return 'Top Paid';
    default:
      return chartType;
  }
}

/**
 * Get a human-readable trending description
 */
export function getTrendingDescription(summary: TrendingSummary): string {
  if (!summary.hasTrending) {
    return '';
  }

  if (summary.totalTrendingCountries === 1) {
    const country = summary.countries[0];
    return `Trending in ${country.countryName} (${formatChartType(country.chartType)} #${country.bestRank})`;
  }

  const countryList = summary.countries
    .slice(0, 3)
    .map(c => c.countryName)
    .join(', ');
  
  const remaining = summary.totalTrendingCountries - 3;
  
  if (remaining > 0) {
    return `Trending in ${countryList} and ${remaining} more`;
  }
  
  return `Trending in ${countryList}`;
}

