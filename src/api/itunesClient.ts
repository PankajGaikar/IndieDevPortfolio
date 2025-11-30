import axios from 'axios';
import { cache } from '../lib/cache';
import {
  iTunesApp,
  iTunesLookupResponse,
  PortfolioApp,
  CacheKeys,
  CACHE_TTL_SECONDS,
  ScanMode,
} from '../lib/types';
import { getCountriesForScanMode } from './chartsClient';

const ITUNES_API_BASE = 'https://itunes.apple.com';

/**
 * Fetch a single app by its App Store ID
 */
export async function fetchAppById(appId: string): Promise<iTunesApp | null> {
  const cacheKey = CacheKeys.appLookup(appId);
  
  return cache.getOrSet(cacheKey, async () => {
    console.log(`[iTunes] Fetching app: ${appId}`);
    
    try {
      const response = await axios.get<iTunesLookupResponse>(
        `${ITUNES_API_BASE}/lookup`,
        {
          params: {
            id: appId,
            country: 'us',
          },
          timeout: 10000,
        }
      );

      if (response.data.resultCount === 0) {
        console.log(`[iTunes] App not found: ${appId}`);
        return null;
      }

      return response.data.results[0];
    } catch (error) {
      console.error(`[iTunes] Error fetching app ${appId}:`, error);
      throw new Error(`Failed to fetch app: ${appId}`);
    }
  }, CACHE_TTL_SECONDS);
}

/**
 * Fetch all apps by a developer ID
 */
export async function fetchDeveloperApps(developerId: string): Promise<iTunesApp[]> {
  const cacheKey = CacheKeys.developerApps(developerId);
  
  return cache.getOrSet(cacheKey, async () => {
    console.log(`[iTunes] Fetching apps for developer: ${developerId}`);
    
    try {
      const response = await axios.get<iTunesLookupResponse>(
        `${ITUNES_API_BASE}/lookup`,
        {
          params: {
            id: developerId,
            entity: 'software', // This returns all iOS apps by the developer
            country: 'us',
          },
          timeout: 15000,
        }
      );

      // First result is the developer/artist, remaining are apps
      const results = response.data.results;
      
      // Filter to only include apps (trackId exists for apps)
      const apps = results.filter((item): item is iTunesApp => 
        'trackId' in item && item.trackId !== undefined
      );

      console.log(`[iTunes] Found ${apps.length} apps for developer ${developerId}`);
      return apps;
    } catch (error) {
      console.error(`[iTunes] Error fetching developer apps ${developerId}:`, error);
      throw new Error(`Failed to fetch apps for developer: ${developerId}`);
    }
  }, CACHE_TTL_SECONDS);
}

/**
 * Get developer ID from an app ID
 */
export async function getDeveloperIdFromApp(appId: string): Promise<{ developerId: string; developerName: string } | null> {
  const app = await fetchAppById(appId);
  
  if (!app) {
    return null;
  }

  return {
    developerId: app.artistId.toString(),
    developerName: app.artistName,
  };
}

/**
 * Convert iTunes app to our internal PortfolioApp format
 */
export function toPortfolioApp(app: iTunesApp): PortfolioApp {
  return {
    id: app.trackId.toString(),
    name: app.trackName,
    iconUrl: app.artworkUrl512 || app.artworkUrl100,
    rating: Math.round(app.averageUserRating * 10) / 10, // Round to 1 decimal
    ratingCount: app.userRatingCount || 0,
    isNewApp: !app.userRatingCount || app.userRatingCount === 0,
    isFree: app.price === 0,
  };
}

/**
 * Format rating count for display (e.g., 1234 -> "1.2K")
 */
export function formatRatingCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Fetch app ratings from a specific country
 */
export async function fetchAppRatingsForCountry(
  appId: string,
  country: string
): Promise<{ rating: number; ratingCount: number } | null> {
  const cacheKey = `app-ratings:${appId}:${country}`;
  
  return cache.getOrSet(cacheKey, async () => {
    try {
      const response = await axios.get<iTunesLookupResponse>(
        `${ITUNES_API_BASE}/lookup`,
        {
          params: { id: appId, country },
          timeout: 10000,
        }
      );

      if (response.data.resultCount === 0 || !response.data.results[0]) {
        return null;
      }

      const app = response.data.results[0] as iTunesApp;
      return {
        rating: app.averageUserRating || 0,
        ratingCount: app.userRatingCount || 0,
      };
    } catch {
      return null;
    }
  }, CACHE_TTL_SECONDS);
}

/**
 * Aggregate ratings from all countries for an app
 * Returns the total rating count across all scanned countries
 */
export async function fetchWorldwideRatings(
  appId: string,
  scanMode: ScanMode
): Promise<{ totalRatingCount: number; countriesWithRatings: number }> {
  const countries = getCountriesForScanMode(scanMode);
  const cacheKey = `worldwide-ratings:${appId}:${scanMode}`;
  
  return cache.getOrSet(cacheKey, async () => {
    console.log(`[iTunes] Fetching worldwide ratings for ${appId} (${countries.length} countries)`);
    
    // Batch requests with concurrency limit to avoid rate limiting
    const BATCH_SIZE = 10;
    let totalRatingCount = 0;
    let countriesWithRatings = 0;
    
    for (let i = 0; i < countries.length; i += BATCH_SIZE) {
      const batch = countries.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(
        batch.map(country => fetchAppRatingsForCountry(appId, country))
      );
      
      for (const result of results) {
        if (result && result.ratingCount > 0) {
          totalRatingCount += result.ratingCount;
          countriesWithRatings++;
        }
      }
    }
    
    console.log(`[iTunes] ${appId}: ${totalRatingCount} total ratings from ${countriesWithRatings} countries`);
    return { totalRatingCount, countriesWithRatings };
  }, CACHE_TTL_SECONDS);
}

/**
 * Fetch worldwide ratings for multiple apps in parallel
 */
export async function fetchWorldwideRatingsForApps(
  appIds: string[],
  scanMode: ScanMode
): Promise<Map<string, { totalRatingCount: number; countriesWithRatings: number }>> {
  console.log(`[iTunes] Fetching worldwide ratings for ${appIds.length} apps`);
  
  const results = new Map<string, { totalRatingCount: number; countriesWithRatings: number }>();
  
  // Process apps sequentially to avoid overwhelming the API
  for (const appId of appIds) {
    const ratings = await fetchWorldwideRatings(appId, scanMode);
    results.set(appId, ratings);
  }
  
  return results;
}

