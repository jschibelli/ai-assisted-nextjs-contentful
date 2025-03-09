// src/lib/optimizations/assetLoader.ts
/**
 * Custom asset loader for Next.js Image component
 *
 * This loader allows the Next.js Image component to work with
 * Contentful assets while applying our optimization strategy.
 */
export const contentfulImageLoader = ({ src, width, quality }) => {
  return optimizeContentfulImage(src, {
    width,
    quality: quality || 75,
    format: "webp",
  });
};
