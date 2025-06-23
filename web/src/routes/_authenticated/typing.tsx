import { createFileRoute } from "@tanstack/react-router";
import Typing from "@/pages/Typing/index";

export const Route = createFileRoute("/_authenticated/typing")({
  component: Typing,
});
