import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import axios, { AxiosError } from "axios";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  QueryFunction,
} from "@tanstack/react-query";

import "./index.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    token: null,
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const defaultQueryFn: QueryFunction = async ({ queryKey }) => {
  const { data } = await axios.get(`${queryKey[0]}`, { withCredentials: true });
  return data;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      retry: (failureCount, error) => {
        // eslint-disable-next-line no-console
        if (import.meta.env.DEV) console.log({ failureCount, error });

        if (failureCount >= 0 && import.meta.env.DEV) return false;
        if (failureCount > 3 && import.meta.env.PROD) return false;

        return !(
          error instanceof AxiosError &&
          [401, 403].includes(error.response?.status ?? 0)
        );
      },
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 10 * 1000, // 10s
    },
    mutations: {
      onError: (error) => {
        // handleServerError(error);

        if (error instanceof AxiosError) {
          if (error.response?.status === 304) {
            // toast({
            //   variant: "destructive",
            //   title: "Content not modified!",
            // });
          }
        }
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          // toast({
          //   variant: "destructive",
          //   title: "Session expired!",
          // });
          const redirect = `${router.history.location.href}`;
          // router.navigate({ to: "/log-in", search: { redirect } });

          // router.navigate({ to: "/sign-in", search: { redirect } });
        }
        if (error.response?.status === 500) {
          // toast({
          //   variant: "destructive",
          //   title: "Internal Server Error!",
          // });
          // router.navigate({ to: "/500" });
        }
        if (error.response?.status === 403) {
          // router.navigate("/forbidden", { replace: true });
        }
      }
    },
  }),
});

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    // <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    // </StrictMode>
  );
}
