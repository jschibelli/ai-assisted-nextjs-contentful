// src/components/ui/ArticleCard.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Entry } from 'contentful';
import { formatDate } from '@/lib/utils/dateFormatter';

interface ArticleCardProps {
  article: Entry<any>;
  compact?: boolean;
}

export default function ArticleCard({ article, compact = false }: ArticleCardProps) {
  const { title, slug, excerpt, featuredImage, publishDate, author, readingTime, category } = article.fields;

  // Format the image URL for Next.js Image component
  const imageUrl = featuredImage?.fields?.file?.url || '';
  const formattedImageUrl = imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl;

  return (
    <article className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow transition-shadow hover:shadow-md ${
      compact ? 'flex flex-row h-32' : 'flex flex-col'
    }`}>
      {/* Image */}
      <div className={`relative ${
        compact ? 'w-32 min-w-[8rem]' : 'aspect-[16/9] w-full'
      }`}>
        {formattedImageUrl ? (
          <Image
            src={formattedImageUrl}
            alt={featuredImage?.fields?.title || title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="bg-gray-300 dark:bg-gray-700 h-full w-full flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 text-xs">No image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-col ${compact ? 'p-4' : 'p-5'}`}>
        {/* Category (if available) */}
        {category && !compact && (
          <Link
            href={`/blog/category/${category.fields.slug}`}
            className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2 hover:underline"
          >
            {category.fields.name}
          </Link>
        )}

        {/* Title */}
        <h3 className={`font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
          compact ? 'text-base mb-1 line-clamp-1' : 'text-xl mb-2'
        }`}>
          <Link href={`/blog/${slug}`}>
            {title}
          </Link>
        </h3>

        {/* Excerpt (not in compact mode) */}
        {!compact && excerpt && (
          <p className="text-gray-600 dark:text-