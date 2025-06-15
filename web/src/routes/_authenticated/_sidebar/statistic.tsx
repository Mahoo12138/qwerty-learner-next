import { createFileRoute } from "@tanstack/react-router";
import StatisticPage from '@/pages/Statistic';

export const Route = createFileRoute("/_authenticated/_sidebar/statistic")({
  component: StatisticPage,
});
