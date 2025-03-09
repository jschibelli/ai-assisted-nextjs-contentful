"use client";

import React, { useState } from "react";
import { useContentful } from "@/hooks/useContentful";
import { useAppContext } from "@/context/AppContext";
import ArticleCard from "@/components/ui/ArticleCard";
import { Entry } from "contentful";

interface ArticleListProps {
  category?: string;
  author?: string;
  tag?: string;
  initialPage?: number;
  postsPerPage?: number;
}

export default function ArticleList({
  category,
  author,
  tag,
  initialPage = 1,
  postsPerPage = 6,
}: ArticleListProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const { locale } = useAppContext();

  // Query parameters based on props and context
  const query: Record<string, any> = {
    content_type: "blogPost",
    limit: postsPerPage,
    skip: (currentPage - 1) * postsPerPage,
    order: "-fields.publishDate",
  };

  // Add conditional filters
  if (category) {
    query["fields.category.sys.id"] = category;
  }
  if (author) {
    query["fields.author.sys.id"] = author;
  }
  if (tag) {
    query["fields.tags"] = tag;
  }
  if (locale) {
    query["locale"] = locale;
  }

  // Fetch articles with SWR caching
  const { data: response, isLoading, isError } = useContentful(query);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
        {Array.from({ length: postsPerPage }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-200 dark:bg-gray-700 rounded-lg h-96"
          ></div>
        ))}
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg text-center">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">
          Failed to load articles
        </h3>
        <p className="text-red-700 dark:text-red-300 mb-4">
          We're having trouble loading the articles. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Refresh
        </button>
      </div>
    );
  }

  // Destructure response
  const articles = response?.items || [];
  const total = response?.total || 0;
  const totalPages = Math.ceil(total / postsPerPage);

  // If no articles found
  if (articles.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
          No articles found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try changing your search criteria or check back later for new content.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Articles grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((article: Entry<any>) => (
          <ArticleCard key={article.sys.id} article={article} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 border rounded-md text-sm font-medium ${
                  currentPage === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
