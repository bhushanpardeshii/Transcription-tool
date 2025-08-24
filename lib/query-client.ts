import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: Error & { status?: number }) => {
        // Don't retry on 4xx errors except 408, 429
        if (error?.status && error?.status >= 400 && error?.status < 500 && ![408, 429].includes(error?.status)) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: (failureCount, error: Error & { status?: number }) => {
        // Don't retry mutations on 4xx errors
        if (error?.status && error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});
