// src/lib/optimizations/dataFetching.ts
/**
 * Optimized Data Fetching Strategy
 *
 * This collection of utilities helps optimize data fetching from Contentful
 * to reduce build times, minimize API calls, and improve overall performance.
 */

import { contentfulClient, getClient } from "@/lib/contentful/client";

// LRU Cache for API responses
const CACHE_SIZE = 100;
const cache = new Map();
const cacheKeys = [];

// Data fetching strategy with tiered caching
export async function fetchWithCache(
  method: "getEntries" | "getEntry" | "getAsset" | "getAssets",
  params: any,
  options = { ttl: 60000, preview: false, forceFresh: false }
) {
  const { ttl, preview, forceFresh } = options;

  // Generate a cache key based on the request
  const cacheKey = JSON.stringify({
    method,
    params,
    preview,
  });

  // Check if we have a fresh cached version and aren't forcing fresh
  if (!forceFresh && cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);

    // If the cache is still valid
    if (Date.now() - timestamp < ttl) {
      return data;
    }
  }

  // Otherwise, fetch fresh data
  const client = getClient(preview);
  const data = await client[method](params);

  // Cache the result
  cache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });

  // Manage cache size with LRU strategy
  if (!cacheKeys.includes(cacheKey)) {
    cacheKeys.push(cacheKey);

    // Evict oldest entries if we exceed cache size
    if (cacheKeys.length > CACHE_SIZE) {
      const oldestKey = cacheKeys.shift();
      if (oldestKey) {
        cache.delete(oldestKey);
      }
    }
  }

  return data;
}

// Function to prefetch multiple entries in parallel
export async function prefetchEntries(
  queries: Array<{ contentType: string; query?: any }>
) {
  return Promise.all(
    queries.map(({ contentType, query = {} }) =>
      fetchWithCache("getEntries", {
        content_type: contentType,
        ...query,
      })
    )
  );
}
