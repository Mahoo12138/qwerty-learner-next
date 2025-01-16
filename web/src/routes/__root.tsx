// import { QueryClient } from '@tanstack/react-query'
import Loading from '@/components/Loading'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
// import GeneralError from '@/features/errors/general-error'
// import NotFoundError from '@/features/errors/not-found-error'

export const Route = createRootRouteWithContext<{
  //   queryClient: QueryClient
  token: String | null
}>()({
  component: () => {
    return (
      <>
        <Outlet />
        {import.meta.env.MODE === 'development' && (
          <>
            {/* <ReactQueryDevtools buttonPosition='bottom-left' /> */}
            <TanStackRouterDevtools position='bottom-right' />
          </>
        )}
      </>
    )
  },
  pendingComponent: Loading,
  //   notFoundComponent: NotFoundError,
  //   errorComponent: GeneralError,
})
