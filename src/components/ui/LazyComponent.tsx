// src/components/ui/LazyComponent.tsx
import React, { Suspense, lazy, ComponentType } from "react";

/**
 * Factory for creating lazy-loaded components with suspense
 * This helps reduce initial bundle size for large component trees
 */
export function createLazyComponent<T>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  fallback: React.ReactNode = (
    <div className="loading-placeholder animate-pulse"></div>
  )
) {
  const LazyComponent = lazy(importFn);

  return (props: T) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}
