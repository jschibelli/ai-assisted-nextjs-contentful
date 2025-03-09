// src/lib/contentful/services/pageService.ts
// Service for fetching and processing page data
import { fetchGraphQL } from "@/lib/contentful/client";
import {
  PAGE_BY_SLUG_QUERY,
  ALL_PAGE_SLUGS_QUERY,
} from "@/lib/contentful/queries/pageQueries";
import { mapPageFromGraphQL } from "@/lib/contentful/mappers/pageMapper";
import { PageContent } from "@/types/contentful";
import { generateSEO } from "@/lib/seo/metadata";

// A simple cache to avoid duplicate requests during SSG
const pageCache = new Map<string, { data: PageContent; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 1 minute

/**
 * Fetches page data by slug with caching
 */
export async function getPageBySlug(
  slug: string,
  preview = false,
  ignoreCache = false
): Promise<{ page: PageContent | null; seo: any }> {
  const cacheKey = `page-${slug}-${preview}`;

  // Check cache unless ignoring
  if (!ignoreCache && pageCache.has(cacheKey)) {
    const cached = pageCache.get(cacheKey)!;

    // Use cache if it's still fresh
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      return {
        page: cached.data,
        seo: generateSEO(cached.data),
      };
    }
  }

  try {
    // Fetch data from Contentful
    const rawData = await fetchGraphQL(
      PAGE_BY_SLUG_QUERY,
      { slug, preview },
      preview
    );

    // Process the data
    const page = mapPageFromGraphQL(rawData);

    // Generate SEO metadata
    const seo = page ? generateSEO(page) : null;

    // Cache the result
    if (page) {
      pageCache.set(cacheKey, {
        data: page,
        timestamp: Date.now(),
      });
    }

    return { page, seo };
  } catch (error) {
    console.error(`[pageService] Error fetching page ${slug}:`, error);
    return { page: null, seo: null };
  }
}

/**
 * Fetches all page slugs for static path generation
 */
export async function getAllPageSlugs(): Promise<string[]> {
  try {
    const data = await fetchGraphQL(ALL_PAGE_SLUGS_QUERY, { limit: 1000 });

    if (!data.pageCollection?.items) {
      return [];
    }

    return data.pageCollection.items.map((item: any) => item.slug);
  } catch (error) {
    console.error("[pageService] Error fetching all page slugs:", error);
    return [];
  }
}
