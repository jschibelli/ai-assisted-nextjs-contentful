// src/components/blog/FeaturedPost.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Entry } from "contentful";
import { formatDate } from "@/lib/utils/dateFormatter";

interface FeaturedPostProps {
  post: Entry<any>;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  // Extract fields from Contentful entry
  const { title, slug, excerpt, featuredImage, publishDate, author } =
    post.fields;

  // Format the image URL for Next.js Image component
  const imageUrl = featuredImage?.fields?.file?.url || "";
  const formattedImageUrl = imageUrl.startsWith("//")
    ? `https:${imageUrl}`
    : imageUrl;

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-shadow hover:shadow-xl">
      <div className="relative aspect-[16/9] w-full">
        {formattedImageUrl ? (
          <Image
            src={formattedImageUrl}
            alt={featuredImage?.fields?.title || title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority // Load with priority since it's a featured post
          />
        ) : (
          <div className="bg-gray-300 dark:bg-gray-700 h-full w-full flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">
              No image available
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
          {publishDate && (
            <time dateTime={publishDate}>{formatDate(publishDate)}</time>
          )}

          {author && (
            <>
              <span>•</span>
              <span>{author.fields.name}</span>
            </>
          )}
        </div>

        <h3 className="text-2xl font-bold mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h3>

        {excerpt && (
          <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
            {excerpt}
          </p>
        )}

        <Link
          href={`/blog/${slug}`}
          className="inline-block mt-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
        >
          Read More
          <span className="ml-1">→</span>
        </Link>
      </div>
    </article>
  );
}
