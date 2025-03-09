// src/components/common/ErrorFallback.tsx
import React from "react";
import Link from "next/link";

interface ErrorFallbackProps {
  error?: Error | null;
  resetErrorBoundary?: () => void;
}

/**
 * Fallback UI displayed when an error is caught by the ErrorBoundary
 */
const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div className="error-container p-6 mx-auto max-w-md text-center">
      <h2 className="text-xl font-bold text-red-600 mb-4">
        Something went wrong
      </h2>

      {process.env.NODE_ENV !== "production" && error && (
        <div className="bg-gray-100 p-4 rounded-md mb-4 text-left overflow-auto max-h-40">
          <p className="font-mono text-sm">{error.message}</p>
        </div>
      )}

      <p className="mb-4">We've logged this issue and will look into it.</p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {resetErrorBoundary && (
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        )}

        <Link href="/">
          <a className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Go to Homepage
          </a>
        </Link>
      </div>
    </div>
  );
};

export default ErrorFallback;