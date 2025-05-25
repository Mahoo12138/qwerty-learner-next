import { createFileRoute } from "@tanstack/react-router";
import Typing from "@/pages/Home/index";

export const Route = createFileRoute("/_authenticated/")({
  component: Typing,
});
