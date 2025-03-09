// src/components/blog/BlogCategories.tsx
import React from "react";
import Link from "next/link";
import { Entry } from "contentful";

interface BlogCategoriesProps {
  categories: Entry<any>[];
}

export default function BlogCategories({ categories }: BlogCategoriesProps) {
  // If no categories, don't render the component
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <h3 className="text-xl font-bold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
        Categories
      </h3>

      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.sys.id}>
            <Link
              href={`/blog/category/${category.fields.slug}`}
              className="flex items-center justify-between group"
            >
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {category.fields.name}
              </span>

              {category.fields.postCount ? (
                <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full px-2 py-1">
                  {category.fields.postCount}
                </span>
              ) : (
                category.fields.posts && (
                  <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full px-2 py-1">
                    {category.fields.posts.length}
                  </span>
                )
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
