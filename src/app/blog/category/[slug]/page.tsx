// src/app/blog/category/[slug]/page.tsx
import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClient } from "@/lib/contentful/client";
import ArticleList from "@/components/ArticleList";
import { generateJsonLd } from "@/lib/seo/metadata";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

// Fetch category data
async function fetchCategory(slug: string) {
  try {
    const client = getClient();
    const response = await client.getEntries({
      content_type: "category",
      "fields.slug": slug,
      include: 1,
    });

    return response.items[0] || null;
  } catch (error) {
    console.error(
      `[fetchCategory] Error fetching category with slug ${slug}:`,
      error
    );
    return null;
  }
}

// Generate static paths for all categories
export async function generateStaticParams() {
  try {
    const client = getClient();
    const response = await client.getEntries({
      content_type: "category",
      select: "fields.slug",
      limit: 100,
    });

    return response.items.map((category) => ({
      slug: category.fields.slug,
    }));
  } catch (error) {
    console.error(
      "[generateStaticParams] Error fetching category slugs:",
      error
    );
    return [];
  }
}

// Generate metadata for category page
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = await fetchCategory(params.slug);

  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    };
  }

  const { name, description } = category.fields;

  return {
    title: `${name} | Blog Categories`,
    description: description || `Browse all articles in the ${name} category`,
    openGraph: {
      title: `${name} | Blog Categories`,
      description: description || `Browse all articles in the ${name} category`,
      url: `https://yoursite.com/blog/category/${params.slug}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await fetchCategory(params.slug);

  if (!category) {
    notFound();
  }

  const { name, description } = category.fields;

  // Generate structured data
  const structuredData = generateJsonLd("collectionPage", {
    name: `${name} - Blog Category`,
    description: description || `Articles in the ${name} category`,
    url: `https://yoursite.com/blog/category/${params.slug}`,
  });

  return (
    <main className="container mx-auto px-4 py-12">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Category header */}
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-bold mb-4">{name}</h1>
        {description && (
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {description}
          </p>
        )}
      </header>

      {/* Article list filtered by category */}
      <ArticleList category={category.sys.id} />
    </main>
  );
}
