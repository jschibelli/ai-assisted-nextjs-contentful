// src/lib/contentful/queries/pageQueries.ts
// GraphQL queries for Contentful
import { gql } from "graphql-request";

// Fragment for SEO fields
export const SEO_FRAGMENT = gql`
  fragment SeoFields on Seo {
    metaTitle
    metaDescription
    openGraphTitle
    openGraphDescription
    openGraphImage {
      title
      description
      contentType
      fileName
      size
      url
      width
      height
    }
    noIndex
    noFollow
    canonicalUrl
  }
`;

// Fragment for rich text content
export const RICH_TEXT_FRAGMENT = gql`
  fragment RichTextFields on RichText {
    json
    links {
      assets {
        block {
          sys {
            id
          }
          contentType
          title
          description
          url
          width
          height
        }
      }
      entries {
        block {
          sys {
            id
            __typename
          }
          ... on Page {
            title
            slug
          }
        }
        inline {
          sys {
            id
            __typename
          }
          ... on Page {
            title
            slug
          }
        }
      }
    }
  }
`;

// Query to get page by slug
export const PAGE_BY_SLUG_QUERY = gql`
  query GetPageBySlug($slug: String!, $preview: Boolean!) {
    pageCollection(limit: 1, where: { slug: $slug }, preview: $preview) {
      items {
        sys {
          id
        }
        title
        slug
        summary
        publishDate
        updatedDate
        contentType
        seo {
          ...SeoFields
        }
        sectionsCollection(limit: 10) {
          items {
            sys {
              id
              __typename
            }
            ... on ContentSection {
              title
              subtitle
              content {
                ...RichTextFields
              }
              media {
                title
                description
                contentType
                fileName
                url
                width
                height
              }
              ctaText
              ctaUrl
              layout
              backgroundColor
              alignment
            }
            ... on HeroSection {
              title
              subtitle
              backgroundImage {
                title
                description
                url
                width
                height
              }
              ctaText
              ctaUrl
              textColor
              overlayOpacity
            }
            ... on FeaturedContentSection {
              title
              subtitle
              layout
              itemsPerRow
              itemsCollection(limit: 12) {
                items {
                  sys {
                    id
                  }
                  title
                  description
                  image {
                    title
                    description
                    url
                    width
                    height
                  }
                  link
                }
              }
            }
          }
        }
        author {
          name
          bio {
            ...RichTextFields
          }
          photo {
            title
            description
            url
            width
            height
          }
          email
        }
      }
    }
  }
  ${SEO_FRAGMENT}
  ${RICH_TEXT_FRAGMENT}
`;

// Query to get all page slugs for static paths
export const ALL_PAGE_SLUGS_QUERY = gql`
  query GetAllPageSlugs($limit: Int = 100) {
    pageCollection(limit: $limit) {
      items {
        slug
      }
    }
  }
`;
