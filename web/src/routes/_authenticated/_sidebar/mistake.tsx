import { createFileRoute } from "@tanstack/react-router";
import MistakePage from '@/pages/Mistake';

export const Route = createFileRoute("/_authenticated/_sidebar/mistake")({
  component: MistakePage,
});
