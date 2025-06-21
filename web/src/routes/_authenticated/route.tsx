import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
  beforeLoad: async ({ location, context }) => {
    console.log("context", context);
    if (!context.host) {
      throw redirect({
        to: "/auth/sign-up",
      });
    }
    if (context.host && !context.token) {
      throw redirect({
        to: "/explore",
        // search: {
        //   redirect: location.href,
        // },
      });
    }
  },
});

function RouteComponent() {
  return (
    // <ScrollArea>
    <Outlet />
    // </ScrollArea>
  );
}
