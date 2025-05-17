import { useEffect } from "react";
import { useGlobalStore } from "./store/global";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useTranslation } from "react-i18next";
import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import { StatusData } from './typings/status';
import Loading from './components/Loading';


import { routeTree } from './routeTree.gen';
import { queryClient } from './api/client';
import { useAuthStore } from './store/auth';



declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const router = createRouter({
  routeTree,
  context: { token: null, host: null },
});

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const { appearance, locale, isAppInit, setIsAppInit, setStatusData, statusData } = useGlobalStore();
  const { token } = useAuthStore();

  const { data, isLoading, error } = useQuery<StatusData>({
    queryKey: ['status'], // 唯一的 query key
    queryFn: async () => {
      const response = await fetch('/api/v1/status');
      if (!response.ok) {
        // 如果请求失败，抛出错误
        throw new Error('Failed to fetch status');
      }
      return response.json();
    },
    staleTime: Infinity, // 数据永不过期
    refetchOnWindowFocus: false, // 窗口聚焦时不重新请求
    retry: 0, // 请求失败不重试
  });

  useEffect(() => {
    if (isLoading) {
      setIsAppInit(true);
    } else if (error) {
      console.error("Error fetching status:", error);
      setStatusData(null); // 请求失败时设置状态数据为 null
      setIsAppInit(false); // 请求失败也结束加载状态
    } else if (data) {
      setStatusData(data); // 请求成功时设置状态数据
      setIsAppInit(false); // 请求成功结束加载状态
    }
  }, [data, isLoading, error, setStatusData, setIsAppInit]);

  useEffect(() => {
    appearance === "dark"
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  }, [appearance]);

  useEffect(() => {
    const currentLocale = locale;
    // This will trigger re-rendering of the whole app.
    i18n.changeLanguage(currentLocale);
    document.documentElement.setAttribute("lang", currentLocale);
    if (["ar", "fa"].includes(currentLocale)) {
      document.documentElement.setAttribute("dir", "rtl");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
    }
  }, [locale]);

  if (isAppInit) {
    return <Loading />;
  }

  return (
    <RouterProvider router={router} context={{ token, host: statusData?.host }} />
  );
};

export default App;
