// src/lib/optimizations/imageTranformer.ts
/**
 * Contentful Image Optimization Strategy
 *
 * This utility transforms Contentful image URLs to optimize delivery
 * based on device and viewport requirements.
 */
export function optimizeContentfulImage(
  imageUrl: string,
  {
    width,
    height,
    quality = 75,
    format = "webp",
    fit = "fill",
    focus = "center",
  }: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "webp" | "jpg" | "png" | "avif";
    fit?: "fill" | "scale" | "crop" | "thumb";
    focus?: string;
  } = {}
) {
  if (!imageUrl) return "";

  // Skip if not a Contentful image
  if (
    !imageUrl.includes("images.ctfassets.net") &&
    !imageUrl.includes("downloads.ctfassets.net")
  ) {
    return imageUrl;
  }

  // Ensure URL has protocol
  const baseUrl = imageUrl.startsWith("//") ? `https:${imageUrl}` : imageUrl;

  // Start building query parameters
  const params = new URLSearchParams();

  // Add optimization parameters
  if (width) params.append("w", width.toString());
  if (height) params.append("h", height.toString());

  // Set image quality (1-100)
  params.append("q", quality.toString());

  // Set format conversion - webp offers significant savings
  params.append("fm", format);

  // Set resizing behavior
  params.append("fit", fit);

  // Set focus point for cropping
  params.append("f", focus);

  // Return the optimized URL
  return `${baseUrl}?${params.toString()}`;
}
