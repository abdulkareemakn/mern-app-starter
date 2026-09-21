import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * The 404 page. Rendered by the root route's notFoundComponent for any URL
 * that doesn't match a route. It lives outside `routes/` because every file in
 * that folder becomes a URL; this page is a fallback, not a route.
 */
export function NotFoundPage() {
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
          <Link className={buttonVariants()} to="/">
            Go home
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
