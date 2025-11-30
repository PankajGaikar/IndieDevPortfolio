import { extractAppId } from '../lib/extractAppId';
import {
  fetchAppById,
  fetchDeveloperApps,
  getDeveloperIdFromApp,
  toPortfolioApp,
  formatRatingCount,
} from '../api/itunesClient';
import { buildTrendingSummary } from './trendingService';
import {
  PortfolioData,
  PortfolioApp,
  MAX_DISPLAYED_APPS,
} from '../lib/types';

export interface PortfolioResult {
  success: true;
  data: PortfolioData;
}

export interface PortfolioError {
  success: false;
  error: string;
  code: 'INVALID_INPUT' | 'DEVELOPER_NOT_FOUND' | 'NO_APPS';
}

export type BuildPortfolioResult = PortfolioResult | PortfolioError;

/**
 * Build a complete developer portfolio from an App Store URL or ID
 */
export async function buildDeveloperPortfolio(
  input: string
): Promise<BuildPortfolioResult> {
  console.log(`[Portfolio] Building portfolio for input: ${input}`);

  // Step 1: Parse the input to get an ID
  const parseResult = extractAppId(input);
  
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error,
      code: 'INVALID_INPUT',
    };
  }

  const { id, type } = parseResult.data;
  let developerId: string;
  let developerName: string;

  // Step 2: If it's an app ID, we need to look up the developer
  if (type === 'app') {
    console.log(`[Portfolio] Got app ID, looking up developer...`);
    const developerInfo = await getDeveloperIdFromApp(id);
    
    if (!developerInfo) {
      return {
        success: false,
        error: `Could not find app with ID: ${id}`,
        code: 'DEVELOPER_NOT_FOUND',
      };
    }
    
    developerId = developerInfo.developerId;
    developerName = developerInfo.developerName;
  } else {
    // It's a developer ID directly
    developerId = id;
    // We'll get the name from the first app
    developerName = '';
  }

  // Step 3: Fetch all apps by this developer
  console.log(`[Portfolio] Fetching apps for developer: ${developerId}`);
  const allApps = await fetchDeveloperApps(developerId);

  if (allApps.length === 0) {
    return {
      success: false,
      error: `No apps found for developer ID: ${developerId}`,
      code: 'NO_APPS',
    };
  }

  // Get developer name from first app if we don't have it yet
  if (!developerName && allApps.length > 0) {
    developerName = allApps[0].artistName;
  }

  // Step 4: Convert to portfolio apps and sort by rating count
  const portfolioApps: PortfolioApp[] = allApps
    .map(toPortfolioApp)
    .sort((a, b) => b.ratingCount - a.ratingCount);

  // Step 5: Calculate stats
  const totalRatings = portfolioApps.reduce((sum, app) => sum + app.ratingCount, 0);
  const displayedApps = portfolioApps.slice(0, MAX_DISPLAYED_APPS);
  const remainingApps = portfolioApps.length - displayedApps.length;

  // Step 6: Check trending status
  const appIds = portfolioApps.map(app => app.id);
  const trendingSummary = await buildTrendingSummary(appIds);

  // Step 7: Build the final portfolio data
  const portfolioData: PortfolioData = {
    developer: {
      id: developerId,
      name: developerName,
    },
    stats: {
      totalApps: portfolioApps.length,
      displayedApps: displayedApps.length,
      remainingApps,
      totalRatings,
    },
    apps: displayedApps,
    trending: trendingSummary,
    generatedAt: new Date().toISOString(),
  };

  console.log(`[Portfolio] Built portfolio for ${developerName}: ${portfolioApps.length} apps, ${totalRatings} total ratings`);

  return {
    success: true,
    data: portfolioData,
  };
}

/**
 * Prepare portfolio data for template rendering
 * Adds formatted values and template-specific flags
 */
export function prepareTemplateData(
  portfolio: PortfolioData,
  style: string = 'dark'
): Record<string, unknown> {
  return {
    developerName: portfolio.developer.name,
    totalApps: portfolio.stats.totalApps,
    totalRatings: formatRatingCount(portfolio.stats.totalRatings),
    apps: portfolio.apps.map(app => ({
      ...app,
      ratingCountFormatted: formatRatingCount(app.ratingCount),
    })),
    hasRemainingApps: portfolio.stats.remainingApps > 0,
    remainingApps: portfolio.stats.remainingApps,
    hasTrending: portfolio.trending.hasTrending,
    noTrending: !portfolio.trending.hasTrending,
    trendingCountryCount: portfolio.trending.totalTrendingCountries,
    trendingCountryLabel: portfolio.trending.totalTrendingCountries === 1 ? 'country' : 'countries',
    trendingCountries: portfolio.trending.countries,
    // Card style
    cardStyle: style,
    isLight: style === 'light',
    isMinimal: style === 'minimal',
  };
}

