import { createFileRoute } from "@tanstack/react-router";
import SignUp from '@/pages/SignUp'

export const Route = createFileRoute("/_public/auth/sign-up")({
  component: () => <SignUp />,
});
