import { createFileRoute } from "@tanstack/react-router";
import SettingPage from "@/pages/Setting";

export const Route = createFileRoute("/_authenticated/_sidebar/setting")({
  component: SettingPage,
});
