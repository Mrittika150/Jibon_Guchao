import { MutationCache, QueryClient } from "@tanstack/react-query";
import { tellOtherWindows } from "./windowSync";

export const queryClient: QueryClient = new QueryClient({
  // After ANY successful save, refresh every query on screen,
  // so Today, Calendar and Health always agree.
   mutationCache: new MutationCache({
    onSuccess: () => {
      void queryClient.invalidateQueries();
      tellOtherWindows(); // and refresh the other window too
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 30_000, 
    },
  },
});