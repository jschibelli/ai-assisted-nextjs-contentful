// src/lib/contentful/mappers/pageMapper.ts
// Transform Contentful raw data to application models
import { Document } from "@contentful/rich-text-types";
import { PageContent, SEOMetadata } from "@/types/contentful";

/**
 * Transforms GraphQL API response to our internal page model
 */
export function mapPageFromGraphQL(rawData: any): PageContent | null {
  if (!rawData?.pageCollection?.items?.[0]) {
    return null;
  }

  const page = rawData.pageCollection.items[0];

  // Map sections from collection
  const sections = page.sectionsCollection?.items.map(mapSection) || [];

  return {
    id: page.sys.id,
    title: page.title,
    slug: page.slug,
    summary: page.summary,
    contentType: page.contentType,
    publishDate: page.publishDate,
    updatedDate: page.updatedDate,
    sections,
    author: page.author
      ? {
          name: page.author.name,
          bio: page.author.bio?.json,
          photo: page.author.photo,
          email: page.author.email,
        }
      : undefined,
    // Add other fields as needed
  };
}

/**
 * Maps a section from GraphQL response based on its type
 */
function mapSection(section: any) {
  // Check the section type using __typename
  switch (section.sys.__typename) {
    case "ContentSection":
      return {
        id: section.sys.id,
        type: "ContentSection",
        title: section.title,
        subtitle: section.subtitle,
        content: section.content?.json,
        media: section.media,
        ctaText: section.ctaText,
        ctaUrl: section.ctaUrl,
        layout: section.layout || "default",
        backgroundColor: section.backgroundColor,
        alignment: section.alignment || "left",
      };

    case "HeroSection":
      return {
        id: section.sys.id,
        type: "HeroSection",
        title: section.title,
        subtitle: section.subtitle,
        backgroundImage: section.backgroundImage,
        ctaText: section.ctaText,
        ctaUrl: section.ctaUrl,
        textColor: section.textColor || "#ffffff",
        overlayOpacity: section.overlayOpacity || 0.5,
      };

    case "FeaturedContentSection":
      return {
        id: section.sys.id,
        type: "FeaturedContentSection",
        title: section.title,
        subtitle: section.subtitle,
        layout: section.layout || "grid",
        itemsPerRow: section.itemsPerRow || 3,
        items:
          section.itemsCollection?.items.map((item: any) => ({
            id: item.sys.id,
            title: item.title,
            description: item.description,
            image: item.image,
            link: item.link,
          })) || [],
      };

    default:
      // Return a generic section object if type is unknown
      return {
        id: section.sys.id,
        type: "UnknownSection",
        rawData: section,
      };
  }
}
