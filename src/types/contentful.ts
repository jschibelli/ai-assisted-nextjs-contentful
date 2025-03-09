// src/types/contentful.ts
// Type definitions for Contentful content models
import { Document } from "@contentful/rich-text-types";
import { Asset, Entry, EntryFields } from "contentful";

// Base interface for SEO metadata
export interface SEOMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: {
    url: string;
    width: number;
    height: number;
    alt: string;
  } | null;
  structuredData: object | null;
}

// Content type for SEO fields
export interface SEOFields {
  metaTitle?: string;
  metaDescription?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImage?: Asset;
  noIndex?: boolean;
  noFollow?: boolean;
  canonicalUrl?: string;
}

// Base page interface
export interface PageContent {
  title: string;
  slug: string;
  summary?: string;
  seo?: Entry<SEOFields>;
  sections?: Entry<ContentSectionFields>[];
  publishDate?: string;
  updatedDate?: string;
  contentType?: string;
  author?: Entry<AuthorFields>;
}

// Author content type
export interface AuthorFields {
  name: string;
  bio?: Document;
  photo?: Asset;
  email?: string;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
}

// Section content types
export interface ContentSectionFields {
  title?: string;
  subtitle?: string;
  content?: Document;
  media?: Asset;
  ctaText?: string;
  ctaUrl?: string;
  layout?: "default" | "media-left" | "media-right";
  backgroundColor?: string;
  alignment?: "left" | "center" | "right";
}

export interface HeroSectionFields {
  title: string;
  subtitle?: string;
  backgroundImage: Asset;
  ctaText?: string;
  ctaUrl?: string;
  textColor?: string;
  overlayOpacity?: number;
}

export interface FeaturedContentSectionFields {
  title?: string;
  subtitle?: string;
  items: Entry<FeaturedItemFields>[];
  layout: "grid" | "carousel" | "list";
  itemsPerRow?: 2 | 3 | 4;
}

export interface FeaturedItemFields {
  title: string;
  description?: string;
  image?: Asset;
  link?: string;
}
