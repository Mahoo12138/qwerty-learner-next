import { createFileRoute } from "@tanstack/react-router";
// import SignIn from "@/pages/SignIn";

export const Route = createFileRoute("/_public/auth/sign-in")({
  // component: () => <SignIn />,
  component: () => <div>Sign In Page</div>,
  beforeLoad(ctx) {
    // TODO: Redirect to root page if already signed in.
  },
});
