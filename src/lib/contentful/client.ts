// src/lib/contentful/client.ts
import { createClient } from "contentful";
import { DocumentNode } from "graphql";
import { GraphQLClient } from "graphql-request";

// Environment variables must be prefixed with NEXT_PUBLIC_ to be accessible on the client side
// For server-only variables, use process.env.VARIABLE_NAME
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const PREVIEW_ACCESS_TOKEN = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || "master";

// Check if we have the necessary environment variables
if (!SPACE_ID || !ACCESS_TOKEN) {
  throw new Error(
    "Contentful environment variables are missing. Please configure CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN."
  );
}

// REST client for Contentful CDA (Content Delivery API)
export const contentfulClient = createClient({
  space: SPACE_ID,
  accessToken: ACCESS_TOKEN,
  environment: ENVIRONMENT,
});

// REST client for Contentful CPA (Content Preview API)
export const contentfulPreviewClient = createClient({
  space: SPACE_ID,
  accessToken: PREVIEW_ACCESS_TOKEN || ACCESS_TOKEN,
  environment: ENVIRONMENT,
  host: "preview.contentful.com",
});

// Get the appropriate client based on preview mode
export const getClient = (preview = false) =>
  preview ? contentfulPreviewClient : contentfulClient;

// GraphQL client for more complex queries
const graphQLEndpoint = `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`;

export const graphQLClient = new GraphQLClient(graphQLEndpoint, {
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
});

export const graphQLPreviewClient = new GraphQLClient(graphQLEndpoint, {
  headers: {
    Authorization: `Bearer ${PREVIEW_ACCESS_TOKEN || ACCESS_TOKEN}`,
    "X-Contentful-Draft": "true",
  },
});

// Get the appropriate GraphQL client based on preview mode
export const getGraphQLClient = (preview = false) =>
  preview ? graphQLPreviewClient : graphQLClient;

// Generic function to fetch data using GraphQL
export async function fetchGraphQL<T>(
  query: DocumentNode | string,
  variables: Record<string, any> = {},
  preview = false
): Promise<T> {
  try {
    const client = getGraphQLClient(preview);
    return await client.request<T>(query, variables);
  } catch (error) {
    console.error("[Contentful GraphQL Error]", error);
    throw new Error(
      `Failed to fetch data from Contentful GraphQL API: ${error}`
    );
  }
}

// Cache for content by ID to reduce duplicate fetches
const contentCache = new Map();

// Generic function to fetch entry by ID with caching
export async function fetchEntryById<T>(
  id: string,
  preview = false,
  invalidateCache = false
): Promise<T> {
  const cacheKey = `${id}-${preview}`;

  // Return cached content unless invalidation is requested
  if (!invalidateCache && contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey);
  }

  try {
    const client = getClient(preview);
    const entry = await client.getEntry<T>(id);

    // Cache the result
    contentCache.set(cacheKey, entry);

    return entry;
  } catch (error) {
    console.error(
      `[Contentful Error] Failed to fetch entry with ID ${id}:`,
      error
    );
    throw new Error(`Failed to fetch entry with ID ${id}: ${error}`);
  }
}
