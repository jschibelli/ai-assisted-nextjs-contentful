// src/components/ui/OptimizedImage.tsx
import React from "react";
import Image from "next/image";
import { contentfulImageLoader } from "@/lib/optimizations/assetLoader";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  layout?: "fixed" | "fill" | "intrinsic" | "responsive";
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  priority?: boolean;
  className?: string;
}

/**
 * Optimized image component that leverages Next.js Image with Contentful optimizations
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  layout = "responsive",
  objectFit = "cover",
  priority = false,
  className = "",
}) => {
  // Handle case where src is undefined or null
  if (!src) {
    return null;
  }

  // Add https: protocol if missing
  const imageSrc = src.startsWith("//") ? `https:${src}` : src;

  return (
    <div className={`image-container ${className}`}>
      <Image
        src={imageSrc}
        alt={alt || ""}
        width={width}
        height={height}
        layout={layout}
        objectFit={objectFit}
        loader={contentfulImageLoader}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  );
};
