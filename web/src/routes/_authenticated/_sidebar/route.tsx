import { createFileRoute } from "@tanstack/react-router";
import SideBarLayout from '@/components/layouts/SiderBar';

export const Route = createFileRoute("/_authenticated/_sidebar")({
  component: SideBarLayout,
});




