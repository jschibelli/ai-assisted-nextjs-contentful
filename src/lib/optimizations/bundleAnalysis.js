// src/lib/optimizations/bundleAnalysis.js
/**
 * Bundle Analysis Configuration
 *
 * This setup helps identify bundle size issues during build
 * Install with: npm install --save-dev @next/bundle-analyzer
 *
 * Usage: Create a next.config.js file that includes this configuration
 */

// next.config.js example
/*
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Existing Next.js config...
  images: {
    domains: ['images.ctfassets.net', 'downloads.ctfassets.net'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
});
*/
