import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { NotFoundPage } from "@/pages/404";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  ),
  // Unknown URLs render the 404 page here, in place of <Outlet />, so anything
  // shared by this root route (providers, nav, footer) wraps the 404 too.
  notFoundComponent: NotFoundPage,
});
