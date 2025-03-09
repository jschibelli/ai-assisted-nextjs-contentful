// src/hooks/useContentful.ts - Enhanced version for Next.js App Router
import useSWR from "swr";
import { contentfulClient } from "@/lib/contentful/client";
import { EntryCollection } from "contentful";

// Define return type for Contentful API responses
type ContentfulResponse<T> = EntryCollection<T>;

// Generic fetcher function for Contentful
const contentfulFetcher = async (
  params: Record<string, any>
): Promise<ContentfulResponse<any>> => {
  try {
    return await contentfulClient.getEntries(params);
  } catch (error) {
    console.error("[contentfulFetcher] Error fetching data:", error);
    throw error;
  }
};

/**
 * Hook for fetching content from Contentful with SWR caching
 *
 * @param query - Query parameters for Contentful API
 * @param options - SWR options for caching behavior
 * @returns Object containing data, loading state, error state, and mutate function
 */
export function useContentful(
  query: Record<string, any>,
  options = {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute
    refreshInterval: 0, // No automatic polling
  }
) {
  // Use SWR for data fetching with caching
  const { data, error, isLoading, mutate } = useSWR(
    // Use a stable key for caching based on the query
    JSON.stringify(query),
    // Parse query from the key and fetch data
    () => contentfulFetcher(query),
    options
  );

  return {
    data,
    isLoading,
    isError: error,
    mutate, // Function to manually revalidate
  };
}

/**
 * Hook for fetching a single entry by ID from Contentful
 *
 * @param entryId - Contentful entry ID
 * @param options - SWR options for caching behavior
 * @returns Object containing entry data, loading state, and error state
 */
export function useContentfulEntry(
  entryId: string,
  options = {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
  }
) {
  const { data, error, isLoading } = useSWR(
    entryId ? `contentful-entry-${entryId}` : null,
    () => contentfulClient.getEntry(entryId),
    options
  );

  return {
    entry: data,
    isLoading,
    isError: error,
  };
}
