// src/app/[slug]/error.tsx
"use client"; // Explicit client component

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Page Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        Oops! Something went wrong
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        We apologize for the inconvenience. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Try Again
      </button>
    </div>
  );
}
