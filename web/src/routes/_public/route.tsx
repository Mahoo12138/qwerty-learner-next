import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Route = createFileRoute("/_public")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div id="content">
      <ScrollArea>
        <Outlet />
      </ScrollArea>
    </div>

  );
}
