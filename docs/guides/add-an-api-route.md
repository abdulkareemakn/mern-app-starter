---
title: Add an API route
description: Add a typed Express route end to end — contract, handler, error handling, and a client call.
---

# Add an API route

This guide adds `GET /api/widgets`, which returns a list of widgets. The shared
contract keeps the server response and client code in agreement, while the server
remains responsible for validating all runtime input.

## 1. Describe the contract

Add the response shape to `packages/shared/src/index.ts`:

```ts
export type WidgetListResponse = {
  widgets: { id: string; name: string }[];
};
```

The shared package contains browser-safe TypeScript contracts, not database models or
runtime server code. Import a contract with `import type` so it is erased from the
compiled JavaScript:

```ts
import type { WidgetListResponse } from "@mern/shared";
```

## 2. Add the handler

In `apps/server/src/app.ts`, import the contract and add the route after
`express.json()` but before the `/api` 404 handler:

```ts
app.get("/api/widgets", (_req, res) => {
  res.json({ widgets: [] } satisfies WidgetListResponse);
});
```

Route order matters. The catch-all `/api` handler answers every unmatched API request
with 404, so a route declared after it cannot be reached.

For asynchronous database work, mark the handler `async` and let errors reach the
existing error middleware:

```ts
app.get("/api/widgets", async (_req, res) => {
  const widgets = await Widget.find().sort({ createdAt: -1 }).lean();
  res.json({
    widgets: widgets.map((widget) => ({
      id: widget._id.toString(),
      name: widget.name,
    })),
  } satisfies WidgetListResponse);
});
```

Express 5 forwards a rejected promise from an async handler to error middleware. Do
not add a `try`/`catch` that only calls `next(error)`.

## 3. Extract a router when it grows

Keep a small endpoint in `app.ts`. When several endpoints share a path or middleware,
move them into a feature router such as `apps/server/src/routes/widgets.ts` and mount
it before the `/api` 404:

```ts
app.use("/api/widgets", widgetsRouter);
```

Do not create a router module for a single short handler solely for symmetry.

## 4. Validate input

TypeScript types disappear at runtime, so they cannot make `req.body` trustworthy.
Validate every field before passing it to Mongoose or another service. For example:

```ts
app.post("/api/widgets", async (req, res) => {
  if (typeof req.body?.name !== "string" || !req.body.name.trim()) {
    res.status(400).json({ error: "Name is required" } satisfies ApiError);
    return;
  }

  const widget = await Widget.create({ name: req.body.name.trim() });
  res.status(201).json({ id: widget.id, name: widget.name });
});
```

Use the shared `ApiError` shape for expected 4xx responses. Schema constraints are a
second line of defence; they do not replace request validation or a clear client error.

## 5. Call it from the client

Import the response contract in the route or component that owns the request:

```ts
import type { WidgetListResponse } from "@mern/shared";

async function getWidgets() {
  const response = await fetch("/api/widgets");
  if (!response.ok) throw new Error("Unable to load widgets");

  const data: WidgetListResponse = await response.json();
  return data.widgets;
}
```

`fetch` does not reject for HTTP errors such as 404 or 500, so check `response.ok`
before reading a success body. Catch the error in an event handler or use the router's
`errorComponent` so the user sees a useful failure state. See
[Add a client page](/guides/add-a-client-page) for a loader example.

## 6. Verify

Start the application with `pnpm dev`, then request the endpoint:

```sh
curl -i http://mern.localhost/api/widgets
pnpm typecheck
pnpm test:integration
```

Confirm that the request returns `200` and a body shaped like `{"widgets":[]}`.
Run the integration suite when the route reads MongoDB, authentication, or other
server configuration.
