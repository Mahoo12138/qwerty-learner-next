import {
  QueryCache,
  QueryClient,
  QueryFunction,
} from "@tanstack/react-query";

const defaultQueryFn: QueryFunction = async ({ queryKey }) => {
  const resp = await fetch(`${queryKey[0]}`, { method: "GET", credentials: "include" });
  if (!resp.ok) {
    throw new Error(resp.statusText);
  }
  return resp.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      retry: (failureCount, error) => {
        // eslint-disable-next-line no-console
        if (import.meta.env.DEV) console.log({ failureCount, error });

        if (error instanceof Error && error.message.includes('status: 401')) {
          return false;
        }

        if (failureCount >= 0 && import.meta.env.DEV) return false;
        if (failureCount > 3 && import.meta.env.PROD) return false;

        return true;
      },
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 10 * 1000, // 10s
    },
    mutations: {
      onError: (error) => {
        // handleServerError(error);
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {


    },
  }),
});