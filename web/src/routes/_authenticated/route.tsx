import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
// import { cn } from "@/lib/utils";
// import { SearchProvider } from "@/context/search-context";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/layout/app-sidebar";
// import SkipToMain from "@/components/skip-to-main";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { useAuth } from "@/stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
  beforeLoad: async ({ location, context }) => {
    console.log("context", context);
    if (!context.token) {
      throw redirect({
        to: "/explore",
        // search: {
        //   redirect: location.href,
        // },
      });
    }
  }
  // beforeLoad: async ({ location, context }) => {
  //   console.log("context", context);
  //   if (!context.token) {
  //     throw redirect({
  //       to: "/log-in",
  //       search: {
  //         // Use the current location to power a redirect after auth.ts
  //         // (Do not use `router.state.resolvedLocation` as it can
  //         // potentially lag behind the actual current location)
  //         redirect: location.href,
  //       },
  //     });
  //   }
  // },
});

function RouteComponent() {
  // const defaultOpen = Cookies.get("sidebar:state") !== "false";
  // const auth = useAuth();

  // const { isPending, error, data } = useQuery<UserInfo>({
  //   queryKey: [HZERO_URL.userInfo],
  // });

  // useEffect(() => {
  //   if (data && !auth.user) {
  //     console.log("setUser");
  //     auth.setUser(data);
  //   }
  // }, [data]);
  return (
    // <SearchProvider>
    //   <SidebarProvider defaultOpen={defaultOpen}>
    //     <SkipToMain />
    //     <AppSidebar />
    <div
      id="content"
    // className={cn(
    //   "max-w-full w-full ml-auto",
    //   "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon))]",
    //   "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
    //   "transition-[width] ease-linear duration-200",
    //   "h-svh flex flex-col"
    // )}
    >
      <ScrollArea>
        <Outlet />
      </ScrollArea>
    </div>
    //   </SidebarProvider>
    // </SearchProvider>
  );
}
