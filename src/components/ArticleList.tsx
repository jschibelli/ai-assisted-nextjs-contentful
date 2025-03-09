// Example usage in a component
// ------------------------------------------------
// src/components/ArticleList.tsx
// ------------------------------------------------
import React from "react";
import { useContentful } from "@/hooks/useContentful";
import { useAppContext } from "@/context/AppContext";
import ArticleCard from "@/components/ui/ArticleCard";

export default function ArticleList({ category = null }) {
  const { locale } = useAppContext();

  // Query parameters based on props and context
  const query = {
    ...(category && { "fields.category": category }),
    "fields.locale": locale,
    order: "-fields.publishDate",
    limit: 10,
  };

  // Fetch articles with SWR caching
  const {
    data: articles,
    isLoading,
    isError,
  } = useContentful("article", query);

  if (isLoading) return <div className="loading-spinner" />;
  if (isError)
    return <div className="error-message">Failed to load articles</div>;

  return (
    <div className="article-grid">
      {articles.map((article) => (
        <ArticleCard key={article.sys.id} article={article} />
      ))}
    </div>
  );
}
