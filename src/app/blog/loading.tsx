// src/app/blog/loading.tsx
import React from "react";

export default function BlogLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Header skeleton */}
      <div className="mb-12 text-center">
        <div className="h-10 bg-gray-200 rounded-md w-64 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded-md max-w-3xl mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-md max-w-2xl mx-auto"></div>
      </div>

      {/* Featured post skeleton */}
      <div className="mb-16">
        <div className="h-8 bg-gray-200 rounded-md w-48 mb-6"></div>
        <div className="h-80 bg-gray-200 rounded-lg mb-4"></div>
      </div>

      {/* Two-column layout skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="h-8 bg-gray-200 rounded-md w-48 mb-6"></div>

          {/* Article skeletons */}
          {[1, 2, 3].map((item) => (
            <div key={item} className="mb-8">
              <div className="h-60 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded-md w-2/3"></div>
            </div>
          ))}
        </div>

        {/* Sidebar skeleton */}
        <div className="space-y-10">
          <div>
            <div className="h-6 bg-gray-200 rounded-md w-32 mb-4"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-4 bg-gray-200 rounded-md"></div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-gray-200 rounded-lg h-64"></div>
        </div>
      </div>
    </div>
  );
}
