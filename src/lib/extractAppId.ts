import { ParseIdResult } from './types';

/**
 * Extracts App Store ID or Developer ID from various input formats.
 * 
 * Supported formats:
 * - https://apps.apple.com/app/id123456789
 * - https://apps.apple.com/us/app/app-name/id123456789
 * - https://apps.apple.com/app/app-name/id123456789
 * - https://itunes.apple.com/us/app/app-name/id123456789
 * - https://itunes.apple.com/app/id123456789
 * - https://apps.apple.com/developer/developer-name/id123456789
 * - Raw ID: "123456789"
 */

// Regex patterns for different URL formats
const PATTERNS = {
  // App URL patterns - matches /app/.../id123456789 or /app/id123456789
  appUrl: /(?:apps\.apple\.com|itunes\.apple\.com)(?:\/[a-z]{2})?\/app\/(?:[^\/]+\/)?id(\d+)/i,
  
  // Developer URL pattern - matches /developer/.../id123456789
  developerUrl: /(?:apps\.apple\.com|itunes\.apple\.com)(?:\/[a-z]{2})?\/developer\/(?:[^\/]+\/)?id(\d+)/i,
  
  // Standalone ID pattern in URL (fallback)
  standaloneIdInUrl: /\/id(\d+)/i,
  
  // Raw numeric ID
  rawId: /^(\d{6,15})$/,
};

/**
 * Extract App ID from an App Store URL or raw ID
 */
export function extractAppId(input: string): ParseIdResult {
  const trimmed = input.trim();
  
  if (!trimmed) {
    return {
      success: false,
      error: 'Input is empty',
    };
  }

  // Check if it's a raw numeric ID
  const rawMatch = trimmed.match(PATTERNS.rawId);
  if (rawMatch) {
    return {
      success: true,
      data: {
        id: rawMatch[1],
        type: 'app', // Assume app ID when raw number is given
      },
    };
  }

  // Check if it's a developer URL
  const developerMatch = trimmed.match(PATTERNS.developerUrl);
  if (developerMatch) {
    return {
      success: true,
      data: {
        id: developerMatch[1],
        type: 'developer',
      },
    };
  }

  // Check if it's an app URL
  const appMatch = trimmed.match(PATTERNS.appUrl);
  if (appMatch) {
    return {
      success: true,
      data: {
        id: appMatch[1],
        type: 'app',
      },
    };
  }

  // Fallback: try to find any /idXXXXX pattern
  const fallbackMatch = trimmed.match(PATTERNS.standaloneIdInUrl);
  if (fallbackMatch) {
    return {
      success: true,
      data: {
        id: fallbackMatch[1],
        type: 'app', // Default to app if we can't determine
      },
    };
  }

  return {
    success: false,
    error: 'Could not extract App Store ID from input. Please provide a valid App Store URL or numeric ID.',
  };
}

/**
 * Validate that a string looks like a valid App Store ID
 */
export function isValidAppStoreId(id: string): boolean {
  return /^\d{6,15}$/.test(id);
}

/**
 * Format an App Store ID into a lookup URL (for debugging/logging)
 */
export function formatAppStoreUrl(id: string, type: 'app' | 'developer'): string {
  if (type === 'developer') {
    return `https://apps.apple.com/developer/id${id}`;
  }
  return `https://apps.apple.com/app/id${id}`;
}

