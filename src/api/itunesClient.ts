import axios from 'axios';
import { cache } from '../lib/cache';
import {
  iTunesApp,
  iTunesLookupResponse,
  PortfolioApp,
  CacheKeys,
  CACHE_TTL_SECONDS,
} from '../lib/types';

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

