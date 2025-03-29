// import { QueryClient } from '@tanstack/react-query'
import App from "@/App";
import Loading from "@/components/Loading";
import { createRootRouteWithContext } from "@tanstack/react-router";
// import GeneralError from '@/features/errors/general-error'
// import NotFoundError from '@/features/errors/not-found-error'

export const Route = createRootRouteWithContext<{
  //   queryClient: QueryClient
  token: String | null;
}>()({
  component: App,
  pendingComponent: Loading,
  //   notFoundComponent: NotFoundError,
  //   errorComponent: GeneralError,
});
