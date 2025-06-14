import { createFileRoute } from "@tanstack/react-router";
import Home from "@/pages/Home/index";

export const Route = createFileRoute("/_authenticated/")({
  component: Home,
});
