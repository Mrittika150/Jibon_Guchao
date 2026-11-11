import { MutationCache, QueryClient } from "@tanstack/react-query";

export const queryClient: QueryClient = new QueryClient({
  // After ANY successful save, refresh every query on screen,
  // so Today, Calendar and Health always agree.
  mutationCache: new MutationCache({
    onSuccess: () => queryClient.invalidateQueries(),
  }),
  defaultOptions: {
    queries: {
      staleTime: 30_000, 
    },
  },
});