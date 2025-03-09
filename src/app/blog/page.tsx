// src/app/blog/[slug]/page.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getClient } from "@/lib/contentful/client";
import { RichTextBlock } from "@/components/content-blocks/RichTextBlock";
import { formatDate } from "@/lib/utils/dateFormatter";
import { generateJsonLd } from "@/lib/seo/metadata";
import ArticleList from "@/components/ArticleList";

// Define types for the page props
interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Dynamic metadata generation based on the post content
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await fetchBlogPost(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  const { title, excerpt, featuredImage } = post.fields;

  // Format image URL for Open Graph
  const ogImageUrl = featuredImage?.fields?.file?.url
    ? `https:${featuredImage.fields.file.url}`
    : "/images/default-blog-og.jpg";

  return {
    title: `${title} | Blog`,
    description: excerpt || "Read our latest blog post",
    openGraph: {
      title: title,
      description: excerpt || "Read our latest blog post",
      type: "article",
      url: `https://yoursite.com/blog/${params.slug}`,
      images: [
        {
          url: ogImageUrl,
          width: featuredImage?.fields?.file?.details?.image?.width || 1200,
          height: featuredImage?.fields?.file?.details?.image?.height || 630,
          alt: featuredImage?.fields?.title || title,
        },
      ],
    },
  };
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
  try {
    const client = getClient();
    const response = await client.getEntries({
      content_type: "blogPost",
      select: "fields.slug",
      limit: 100, // Adjust based on your content volume
    });

    return response.items.map((post) => ({
      slug: post.fields.slug,
    }));
  } catch (error) {
    console.error("[generateStaticParams] Error fetching blog slugs:", error);
    return [];
  }
}

// Fetch blog post data
async function fetchBlogPost(slug: string) {
  try {
    const client = getClient();
    const response = await client.getEntries({
      content_type: "blogPost",
      "fields.slug": slug,
      include: 2, // Include linked entries
    });

    return response.items[0] || null;
  } catch (error) {
    console.error(
      `[fetchBlogPost] Error fetching post with slug ${slug}:`,
      error
    );
    return null;
  }
}

// Fetch related posts
async function fetchRelatedPosts(
  currentPostId: string,
  categoryId?: string,
  limit = 3
) {
  try {
    const client = getClient();
    const query: Record<string, any> = {
      content_type: "blogPost",
      limit,
      order: "-sys.createdAt",
      "sys.id[ne]": currentPostId, // Exclude current post
    };

    // Filter by category if available
    if (categoryId) {
      query["fields.category.sys.id"] = categoryId;
    }

    const response = await client.getEntries(query);
    return response.items || [];
  } catch (error) {
    console.error("[fetchRelatedPosts] Error fetching related posts:", error);
    return [];
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await fetchBlogPost(params.slug);

  // If post not found, return 404
  if (!post) {
    notFound();
  }

  // Extract post fields
  const {
    title,
    content,
    publishDate,
    updatedDate,
    author,
    category,
    featuredImage,
    tags,
    readingTime,
  } = post.fields;

  // Fetch related posts based on category
  const categoryId = category?.sys?.id;
  const relatedPosts = await fetchRelatedPosts(post.sys.id, categoryId);

  // Generate JSON-LD structured data for blog post
  const structuredData = generateJsonLd("article", {
    title,
    description: post.fields.excerpt,
    publishDate,
    updatedDate,
    author: author?.fields?.name,
    image: featuredImage?.fields?.file?.url
      ? `https:${featuredImage.fields.file.url}`
      : null,
    url: `https://yoursite.com/blog/${params.slug}`,
  });

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <article className="container mx-auto px-4 py-12">
        {/* Post header */}
        <header className="max-w-4xl mx-auto mb-10 text-center">
          {/* Category */}
          {category && (
            <Link
              href={`/blog/category/${category.fields.slug}`}
              className="inline-block text-blue-600 dark:text-blue-400 font-medium mb-4 hover:underline"
            >
              {category.fields.name}
            </Link>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>

          {/* Meta information */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-gray-600 dark:text-gray-400 mb-8">
            {/* Publication date */}
            {publishDate && (
              <time dateTime={publishDate} className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {formatDate(publishDate)}
              </time>
            )}

            {/* Reading time */}
            {readingTime && (
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {readingTime} min read
              </span>
            )}

            {/* Author info (if available) */}
            {author && (
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>{author.fields.name}</span>
              </div>
            )}
          </div>

          {/* Featured image */}
          {featuredImage && (
            <div className="relative w-full h-[50vh] max-h-[600px] rounded-xl overflow-hidden mb-12">
              <Image
                src={`https:${featuredImage.fields.file.url}`}
                alt={featuredImage.fields.title || title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}
        </header>

        {/* Article content */}
        <div className="max-w-3xl mx-auto">
          {content && (
            <RichTextBlock
              content={content}
              className="prose dark:prose-invert lg:prose-lg mx-auto"
            />
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="mt-10 pt-8 border-t">
              <h3 className="text-lg font-medium mb-4">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${encodeURIComponent(tag)}`}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Author bio */}
          {author && author.fields.bio && (
            <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                {author.fields.photo ? (
                  <Image
                    src={`https:${author.fields.photo.fields.file.url}`}
                    alt={author.fields.name}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-[60px] h-[60px] rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-500 dark:text-gray-300">
                      {author.fields.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold">{author.fields.name}</h3>
                  {author.fields.role && (
                    <p className="text-gray-600 dark:text-gray-400">
                      {author.fields.role}
                    </p>
                  )}
                </div>
              </div>

              <RichTextBlock
                content={author.fields.bio}
                className="text-gray-700 dark:text-gray-300"
              />
            </div>
          )}
        </div>
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="container mx-auto px-4 py-12 border-t">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost) => (
              <ArticleCard key={relatedPost.sys.id} article={relatedPost} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
