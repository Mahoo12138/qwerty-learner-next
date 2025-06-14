import Account from "@/pages/Setting";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_sidebar/setting/")({
  component: Account,
});
