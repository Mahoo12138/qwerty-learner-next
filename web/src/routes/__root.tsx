import Loading from "@/components/Loading";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRouteWithContext<{
  //   queryClient: QueryClient
  token: {} | null;
  host: String | null;
}>()({
  component: () => <>
    <Outlet />
    {import.meta.env.MODE === "development" && (
      <>
        {/* <ReactQueryDevtools buttonPosition='bottom-left' /> */}
        <TanStackRouterDevtools position="bottom-right" />
      </>
    )}
  </>,
  pendingComponent: Loading,
  //   notFoundComponent: NotFoundError,
  //   errorComponent: GeneralError,
});
