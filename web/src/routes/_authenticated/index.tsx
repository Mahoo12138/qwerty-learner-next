import { createFileRoute } from "@tanstack/react-router";
// import Typing from "@/pages/Typing";

export const Route = createFileRoute("/_authenticated/")({
  component: () => <>TEST PAGE</>,
});
