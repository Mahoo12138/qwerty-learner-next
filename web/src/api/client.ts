import {
  QueryCache,
  QueryClient,
  QueryFunction,
} from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { refreshToken as callRefreshTokenApi } from "@/api/auth";

// Used to store pending token refresh requests to prevent concurrent refreshes
let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: any | null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(true); // Token refreshed, retry original request
    }
  });
  failedQueue = [];
};

export const fetcher = async (
  url: string,
  options?: RequestInit
): Promise<any> => {
  const { accessToken, tokenExpires, refreshToken } = useAuthStore.getState().token || {};
  const authStore = useAuthStore.getState();

  const headers = new Headers(options?.headers);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  // Check if token is about to expire (e.g., refresh 5 minutes before expiration)
  const isTokenExpired = tokenExpires && Date.now() >= tokenExpires;
  const isRefreshNeeded = isTokenExpired && refreshToken && !isRefreshing;

  if (isRefreshNeeded) {
    if (!isRefreshing) {
      isRefreshing = true;
      authStore.startLoading(); // Set loading state for auth store
      try {
        const refreshRes = await callRefreshTokenApi({ refreshToken });
        authStore.setToken({
          accessToken: refreshRes.accessToken,
          refreshToken: refreshRes.refreshToken,
          tokenExpires: refreshRes.tokenExpires,
        });
        processQueue(null); // Resolve all pending requests
      } catch (refreshError) {
        processQueue(refreshError); // Reject all pending requests
        authStore.logout(); // Refresh failed, logout user
        // You might want to navigate to login page here
        throw refreshError; // Re-throw to propagate the error
      } finally {
        isRefreshing = false;
        authStore.stopLoading(); // Clear loading state
      }
    }

    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then(() => {
      // Retry the original request with the new token
      const newAccessToken = useAuthStore.getState().token?.accessToken;
      if (newAccessToken) {
        headers.set("Authorization", `Bearer ${newAccessToken}`);
      }
      return fetch(url, { ...options, headers }).then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      });
    });
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 && refreshToken && !isRefreshing) {
    if (!isRefreshing) {
      isRefreshing = true;
      authStore.startLoading(); // Set loading state for auth store
      try {
        const refreshRes = await callRefreshTokenApi({ refreshToken });
        authStore.setToken({
          accessToken: refreshRes.accessToken,
          refreshToken: refreshRes.refreshToken,
          tokenExpires: refreshRes.tokenExpires,
        });
        processQueue(null); // Resolve all pending requests
        // Retry the original request
        const newAccessToken = useAuthStore.getState().token?.accessToken;
        if (newAccessToken) {
          headers.set("Authorization", `Bearer ${newAccessToken}`);
        }
        return fetch(url, { ...options, headers }).then((res) => {
          if (!res.ok) {
            throw new Error(res.statusText);
          }
          return res.json();
        });
      } catch (refreshError) {
        processQueue(refreshError); // Reject all pending requests
        authStore.logout(); // Refresh failed, logout user
        // You might want to navigate to login page here
        throw refreshError; // Re-throw to propagate the error
      } finally {
        isRefreshing = false;
        authStore.stopLoading(); // Clear loading state
      }
    } else {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => {
        // Retry the original request with the new token
        const newAccessToken = useAuthStore.getState().token?.accessToken;
        if (newAccessToken) {
          headers.set("Authorization", `Bearer ${newAccessToken}`);
        }
        return fetch(url, { ...options, headers }).then((res) => {
          if (!res.ok) {
            throw new Error(res.statusText);
          }
          return res.json();
        });
      });
    }
  }

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
};

const defaultQueryFn: QueryFunction = async ({ queryKey }) => {
  const [url, options] = queryKey;
  if (typeof url === "string") {
    return fetcher(url, options as RequestInit);
  }
  throw new Error("Invalid query key format");
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache(),
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      retry: (failureCount, error) => {
        // Only retry if it's not a 401 and not a refresh token failure
        const isAuthError = (error as any)?.message === "Unauthorized"; // Adjust error message as needed
        return failureCount < 3 && !isAuthError;
      },
    },
    mutations: {
      mutationFn: async (variables: unknown) => {
        const { url, options } = variables as { url: string; options?: RequestInit };
        return fetcher(url, options);
      },
      retry: (failureCount, error) => {
        const isAuthError = (error as any)?.message === "Unauthorized";
        return failureCount < 3 && !isAuthError;
      },
    },
  },
});