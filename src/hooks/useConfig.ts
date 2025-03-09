// src/hooks/useConfig.ts
import useSWR from "swr";

const configFetcher = (url: string) => fetch(url).then((res) => res.json());

export function useRuntimeConfig() {
  const { data, error } = useSWR("/api/config", configFetcher, {
    // Configuration should be relatively stable, so revalidate infrequently
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 300000, // 5 minutes
    dedupingInterval: 60000, // 1 minute
  });

  return {
    config: data,
    isLoading: !error && !data,
    isError: error,
  };
}
