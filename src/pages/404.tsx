// src/pages/404.tsx - Custom 404 Page
import React from "react";
import Link from "next/link";
import Head from "next/head";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found | Your Site</title>
        <meta name="robots" content="noindex, follow" />
      </Head>

      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Page Not Found
        </h2>
        <p className="text-gray-600 max-w-md mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link href="/">
          <a className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Return to Homepage
          </a>
        </Link>
      </div>
    </>
  );
}
