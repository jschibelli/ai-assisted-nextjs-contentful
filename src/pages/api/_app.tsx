// src/pages/_app.tsx - Error Boundary Integration
import type { AppProps } from "next/app";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { AppProvider } from "@/context/AppContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default MyApp;

// src/lib/api/apiErrorHandler.ts - API Error Handler
type ApiErrorOptions = {
  url: string;
  method: string;
  requestData?: any;
  context?: string;
};

/**
 * Standardized API error handling
 */
export function handleApiError(error: any, options: ApiErrorOptions) {
  // Extract useful information from the error
  const status = error.response?.status || "unknown";
  const message = error.message || "Unknown error";
  const responseData = error.response?.data;

  // Create structured error object
  const errorDetails = {
    message,
    status,
    timestamp: new Date().toISOString(),
    request: {
      url: options.url,
      method: options.method,
      data: options.requestData,
    },
    response: responseData,
    context: options.context,
  };

  // Log to console in development
  if (process.env.NODE_ENV !== "production") {
    console.error("API Error:", errorDetails);
  }

  // Log to error service in production
  if (process.env.NODE_ENV === "production" && typeof window !== "undefined") {
    // Integrate with your error tracking service
    if (window.errorLogger) {
      window.errorLogger.captureException(error, {
        extra: errorDetails,
      });
    }
  }

  // Return standardized error for consistent handling
  return {
    error: true,
    message: error.response?.data?.message || message,
    status,
    timestamp: errorDetails.timestamp,
  };
}
