---
title: Client Pages
description: Add typed pages, loaders, links, path parameters, and search parameters with TanStack Router.
---

# Client pages with TanStack Router

This starter kit uses [TanStack Router](https://tanstack.com/router/latest) with file-based routing. Files in `apps/client/src/routes/` become URLs, and the generated route tree provides typed navigation, parameters, search values, and loader data.

## Project structure

```text
apps/client/src/
  routes/
    __root.tsx          # Root layout and 404 component
    index.tsx           # /
    widgets.tsx         # /widgets
    widgets.$id.tsx     # /widgets/:id
  main.tsx              # Mounts RouterProvider
  router.tsx            # Creates and registers the router
  routeTree.gen.ts      # Generated route tree, do not edit
```

## Add widget pages

### Create a page

Create a file in `apps/client/src/routes/` and export a constant named `Route`:

```tsx title="apps/client/src/routes/widgets.tsx"
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/widgets")({
  component: WidgetsPage,
});

function WidgetsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Widgets</h1>
    </main>
  );
}
```

### Generated route types

TanStack Router generates `apps/client/src/routeTree.gen.ts` during development, builds, and type checking. Commit this file, but never edit it manually.

Regenerate it explicitly when needed:

```sh
pnpm --filter @mern/client generate-routes
```

### Link between pages

Use `Link` for internal navigation:

```tsx
import { Link } from "@tanstack/react-router";

<Link to="/widgets">View widgets</Link>
```

TypeScript checks the destination and any required parameters against the generated route tree.

### Dynamic paths

Create `widgets.$id.tsx` for `/widgets/:id`:

```tsx title="apps/client/src/routes/widgets.$id.tsx"
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/widgets/$id")({
  component: WidgetPage,
});

function WidgetPage() {
  const { id } = Route.useParams();
  return <main>Widget {id}</main>;
}
```

Link to it with typed parameters:

```tsx
<Link to="/widgets/$id" params={{ id: widget.id }}>
  {widget.name}
</Link>
```

Path parameters are strings in the browser. Validate or coerce them again when they reach the API.

## Load and filter data

### Load API data

Use a route loader when the page needs data before rendering:

```tsx title="apps/client/src/routes/widgets.tsx"
import type { WidgetListResponse } from "@mern/shared";
import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";

export const Route = createFileRoute("/widgets")({
  loader: async () => {
    const { data } = await axios.get<WidgetListResponse>("/api/widgets");
    return data;
  },
  pendingComponent: () => <p role="status">Loading widgets...</p>,
  errorComponent: () => (
    <p role="alert">Unable to load widgets. Please try again.</p>
  ),
  component: WidgetsPage,
});

function WidgetsPage() {
  const { widgets } = Route.useLoaderData();

  return (
    <main>
      <h1>Widgets</h1>
      {widgets.length === 0 ? (
        <p>No widgets yet.</p>
      ) : (
        <ul>
          {widgets.map((widget) => (
            <li key={widget.id}>{widget.name}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
```

This starter is a client-rendered Vite application. Loaders run in the browser during navigation. Requests to `/api` use Vite's same-origin proxy in development, so session cookies are included without a separate API origin or CORS setup.

### Search parameters

Use `validateSearch` to give query-string values a stable type and default:

```tsx
export const Route = createFileRoute("/widgets")({
  validateSearch: (search: Record<string, unknown>) => {
    const page = Number(search.page);
    return { page: Number.isInteger(page) && page > 0 ? page : 1 };
  },
  component: WidgetsPage,
});

function WidgetsPage() {
  const { page } = Route.useSearch();
  return <p>Page {page}</p>;
}
```

Create typed links by supplying the search object:

```tsx
<Link to="/widgets" search={{ page: 2 }}>
  Next page
</Link>
```

Client validation improves navigation, but the server must still validate its own query parameters because callers can bypass the UI.

## Root layout and 404 page

`routes/__root.tsx` renders the shared layout through `<Outlet />` and supplies `notFoundComponent`. Providers, navigation, or a footer added to the root route also wrap every child page and the 404 page.

See [404 page](/build/not-found-page) before changing the fallback.

## Verify

Run the client, open `http://localhost:3000/widgets`, and check its loading, empty, success, and error states. Then run:

```sh
pnpm --filter @mern/client generate-routes
pnpm typecheck
pnpm check
```

## Next step

Continue to [Emails](/build/emails) when a feature needs to notify someone.

## References

- [TanStack Router documentation](https://tanstack.com/router/latest)
- [File-based routing](https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing)
- [Data loading](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading)
- [Search parameters](https://tanstack.com/router/latest/docs/framework/react/guide/search-params)
- [API routes](/build/api-routes)
- [Authentication](/build/authentication)
