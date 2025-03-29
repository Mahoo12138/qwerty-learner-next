import { useEffect } from "react";
import { useGlobalStore } from "./store/global";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useTranslation } from "react-i18next";

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const { appearance, locale } = useGlobalStore();
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

  return (
    <>
      <Outlet />
      {import.meta.env.MODE === "development" && (
        <>
          {/* <ReactQueryDevtools buttonPosition='bottom-left' /> */}
          <TanStackRouterDevtools position="bottom-right" />
        </>
      )}
    </>
  );
};

export default App;
