// ------------------------------------------------
// src/hooks/useContentful.ts - Using SWR for data fetching
// ------------------------------------------------
import useSWR from "swr";
import { contentfulClient } from "@/lib/contentful/client";

// Generic fetcher function for Contentful
const contentfulFetcher = async ({ contentType, query, options = {} }) => {
  const { items } = await contentfulClient.getEntries({
    content_type: contentType,
    ...query,
    ...options,
  });
  return items;
};

// Hook for fetching content from Contentful with caching
export function useContentful(contentType, query = {}, options = {}) {
  const { data, error, isLoading, mutate } = useSWR(
    // Key includes all parameters to ensure proper caching
    { contentType, query, options },
    contentfulFetcher,
    {
      revalidateOnFocus: false, // Don't revalidate when window focuses
      revalidateOnReconnect: true, // Revalidate when reconnecting
      dedupingInterval: 60000, // Dedupe requests within 1 minute
    }
  );

  return {
    data,
    isLoading,
    isError: error,
    mutate, // Function to manually revalidate
  };
}
