// src/lib/seo/metadata.ts
import { Entry } from "contentful";
import { PageContent, SEOMetadata } from "@/types/contentful";

// Helper to safely get nested values
const getNestedValue = (obj: any, path: string, defaultValue: any = null) => {
  const value = path
    .split(".")
    .reduce(
      (prev, curr) =>
        prev && prev[curr] !== undefined ? prev[curr] : undefined,
      obj
    );
  return value !== undefined ? value : defaultValue;
};

/**
 * Generate SEO metadata from a Contentful page entry
 */
export function generateSEO(pageEntry: Entry<PageContent>): SEOMetadata {
  const { fields } = pageEntry;

  // Site base URL from environment variable
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  // Default metadata
  const defaultMetadata: SEOMetadata = {
    title: "Default Page Title",
    description: "Default page description for the website.",
    canonicalUrl: baseUrl,
    ogTitle: "",
    ogDescription: "",
    ogImage: null,
    structuredData: null,
  };

  // If no page found, return defaults
  if (!fields) {
    return defaultMetadata;
  }

  // Get SEO fields from the page
  // This assumes a specific structure - adjust based on your content model
  const seoFields = fields.seo?.fields || {};

  // Create canonical URL
  const slug = fields.slug || "";
  const canonicalUrl = `${baseUrl}/${slug === "home" ? "" : slug}`;

  // Prepare structured data for rich results
  // This is a basic example for an article - expand based on your content types
  const structuredData =
    fields.contentType === "article"
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: fields.title || defaultMetadata.title,
          description: getNestedValue(
            seoFields,
            "metaDescription",
            defaultMetadata.description
          ),
          datePublished: fields.publishDate || pageEntry.sys.createdAt,
          dateModified: fields.updatedDate || pageEntry.sys.updatedAt,
          author: {
            "@type": "Person",
            name: getNestedValue(fields, "author.fields.name", "Site Author"),
          },
          publisher: {
            "@type": "Organization",
            name: process.env.NEXT_PUBLIC_SITE_NAME || "Site Name",
            logo: {
              "@type": "ImageObject",
              url: `${baseUrl}/logo.png`,
            },
          },
          image: getNestedValue(
            seoFields,
            "openGraphImage.fields.file.url",
            null
          ),
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": canonicalUrl,
          },
        }
      : null;

  // Featured image for Open Graph
  const ogImage = seoFields.openGraphImage?.fields?.file
    ? {
        url: `https:${seoFields.openGraphImage.fields.file.url}`,
        width:
          seoFields.openGraphImage.fields.file.details?.image?.width || 1200,
        height:
          seoFields.openGraphImage.fields.file.details?.image?.height || 630,
        alt: seoFields.openGraphImage.fields.title || fields.title || "",
      }
    : null;

  // Return compiled SEO metadata
  return {
    title: seoFields.metaTitle || fields.title || defaultMetadata.title,
    description:
      seoFields.metaDescription ||
      fields.summary ||
      defaultMetadata.description,
    canonicalUrl,
    ogTitle:
      seoFields.openGraphTitle ||
      seoFields.metaTitle ||
      fields.title ||
      defaultMetadata.title,
    ogDescription:
      seoFields.openGraphDescription ||
      seoFields.metaDescription ||
      fields.summary ||
      defaultMetadata.description,
    ogImage,
    structuredData,
  };
}

/**
 * Generate JSON-LD for different content types
 * Can be expanded for different structured data types
 */
export function generateJsonLd(type: string, data: any): object {
  switch (type) {
    case "article":
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: data.title,
        description: data.description,
        datePublished: data.publishDate,
        dateModified: data.updatedDate,
        author: {
          "@type": "Person",
          name: data.author?.name || "Site Author",
        },
        // Additional article-specific fields
      };

    case "product":
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: data.name,
        description: data.description,
        // Additional product-specific fields
      };

    // Add more types as needed

    default:
      return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: data.title,
        description: data.description,
      };
  }
}
