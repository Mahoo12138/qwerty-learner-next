import { createFileRoute } from "@tanstack/react-router";
import ProfilePage from '@/pages/Profile';

export const Route = createFileRoute("/_authenticated/_sidebar/profile")({
  component: ProfilePage,
});
