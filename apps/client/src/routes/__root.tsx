import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  ),
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <main className="mx-auto flex min-h-svh max-w-lg items-center px-4 py-12">
      <Card className="w-full text-center">
        <CardHeader>
          <p className="text-sm font-medium text-muted-foreground">404</p>
          <CardTitle>
            <h1 className="text-2xl">Page not found</h1>
          </CardTitle>
          <CardDescription>
            The page you’re looking for doesn’t exist or may have moved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Check the address or return to the home page.
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button render={<Link to="/" />}>Go home</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
