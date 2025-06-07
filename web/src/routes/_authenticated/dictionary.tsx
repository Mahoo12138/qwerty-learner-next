import { createFileRoute } from "@tanstack/react-router";
import DictionaryPage from "@/pages/Dictionary";

export const Route = createFileRoute("/_authenticated/dictionary")({
  component: DictionaryPage,
});
