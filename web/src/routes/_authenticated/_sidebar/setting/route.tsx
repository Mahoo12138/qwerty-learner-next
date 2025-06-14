import { createFileRoute } from "@tanstack/react-router";
import SettingLayout from '@/components/layouts/Setting';

export const Route = createFileRoute("/_authenticated/_sidebar/setting")({
  component: SettingLayout,
});
