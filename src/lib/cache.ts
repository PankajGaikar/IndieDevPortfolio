import NodeCache from 'node-cache';
import { CACHE_TTL_SECONDS } from './types';

/**
 * Simple in-memory cache with TTL support.
 * Default TTL: 1 hour (3600 seconds)
 */
class CacheService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: CACHE_TTL_SECONDS,
      checkperiod: 120, // Check for expired keys every 2 minutes
      useClones: false, // For better performance
    });
  }

  /**
   * Get a value from cache
   */
  get<T>(key: string): T | undefined {
    const value = this.cache.get<T>(key);
    if (value !== undefined) {
      console.log(`[Cache] HIT: ${key}`);
    } else {
      console.log(`[Cache] MISS: ${key}`);
    }
    return value;
  }

  /**
   * Set a value in cache with optional custom TTL
   */
  set<T>(key: string, value: T, ttlSeconds?: number): boolean {
    console.log(`[Cache] SET: ${key} (TTL: ${ttlSeconds || CACHE_TTL_SECONDS}s)`);
    if (ttlSeconds !== undefined) {
      return this.cache.set(key, value, ttlSeconds);
    }
    return this.cache.set(key, value);
  }

  /**
   * Delete a key from cache
   */
  delete(key: string): number {
    return this.cache.del(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.flushAll();
    console.log('[Cache] Cleared all entries');
  }

  /**
   * Get cache statistics
   */
  stats(): NodeCache.Stats {
    return this.cache.getStats();
  }

  /**
   * Get or set pattern - if key exists, return it; otherwise compute and cache
   */
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlSeconds?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    const value = await fetchFn();
    this.set(key, value, ttlSeconds);
    return value;
  }
}

// Export singleton instance
export const cache = new CacheService();

