---
title: Add a client page
description: Create a TanStack Router file route, reach it in the browser, and link to it from another page.
---

# Add a client page

The client uses TanStack Router's file-based routing. A file under
`apps/client/src/routes/` declares the URL, loader, and component for a page; the
router plugin turns those files into a typed route tree.

## 1. Create the route file

Create `apps/client/src/routes/widgets.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/widgets")({ component: Widgets });

function Widgets() {
  return <main className="mx-auto max-w-lg p-8">Widgets</main>;
}
```

This creates the `/widgets` route. The exported constant must be named `Route` so the
file-route generator can find it.

## 2. Understand generated types

Development and build commands generate `apps/client/src/routeTree.gen.ts`. The file
connects route files to the router and supplies the route paths used by TypeScript.
It is committed so a fresh checkout can typecheck consistently, but it must not be
edited by hand; your edits would be replaced the next time routes are generated.

If the generated tree is stale, run:

```sh
pnpm --filter @mern/client generate-routes
```

## 3. Link between pages

Use TanStack Router's `Link` instead of a plain anchor for navigation within the app:

```tsx
import { Link } from "@tanstack/react-router";

<Link to="/widgets">View widgets</Link>
```

Because the generated router is registered in `src/router.tsx`, TypeScript checks the
`to` path and any required path or search parameters. `Link` also navigates without a
full page reload.

## 4. Load data

Add a loader and explicit pending and error states to the route:

```tsx
import type { WidgetListResponse } from "@mern/shared";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/widgets")({
  loader: async () => {
    const response = await fetch("/api/widgets");
    if (!response.ok) throw new Error("Unable to load widgets");

    const data: WidgetListResponse = await response.json();
    return data;
  },
  pendingComponent: () => <main className="p-8">Loading widgets…</main>,
  errorComponent: () => (
    <main className="p-8" role="alert">
      Unable to load widgets. Please try again.
    </main>
  ),
  component: Widgets,
});

function Widgets() {
  const { widgets } = Route.useLoaderData();

  return (
    <main className="mx-auto max-w-lg p-8">
      <h1 className="text-2xl font-semibold">Widgets</h1>
      {widgets.length ? (
        <ul className="mt-4 list-disc pl-5">
          {widgets.map((widget) => (
            <li key={widget.id}>{widget.name}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-muted-foreground">No widgets yet.</p>
      )}
    </main>
  );
}
```

The loader runs before the page renders, `Route.useLoaderData()` receives its typed
result, and a thrown request error selects `errorComponent`. Browser requests to a
session-protected endpoint include same-origin cookies automatically; the server must
still enforce the session as described in
[Protect a route](/guides/protect-a-route).

## 5. Verify

With `pnpm dev` running, visit `http://mern.localhost/widgets` and follow the new link
from its parent page. Confirm the loading, empty, populated, and error states, then run:

```sh
pnpm typecheck
```

The command regenerates route types and checks that `/widgets`, its loader data, and
links all agree.
