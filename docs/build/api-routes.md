---
title: API Routes
description: Build Express 5 API routes with shared response contracts, Zod request validation, and integration tests.
---

# API routes with Express

This starter kit uses Express 5 to expose application data to its React client. An API route is the agreement between the browser and server: what the browser can ask
for, what it gets back, and what happens when the request is invalid.

<!-- NOTE: No need to mention this here. Have a proper docs section for creating individual routers as it's a very common problem. Something like it exists already but isn't proper and doesn't flow correctly. -->

Small routes live in `apps/server/src/app.ts`; extract a feature router only when
several related endpoints make that file difficult to scan.

Keep two boundaries distinct:

- Zod schemas validate request data at runtime and infer its TypeScript type.
- `@mern/shared` contains browser-safe response types used by both the server and client.

## Project structure

```text
apps/server/src/
  app.ts                    # Express setup, API routes, 404, error handler
  middleware/
    auth.ts                 # Session validation
    validate.ts             # Zod request validation
  schemas/
    create-user.ts          # Request schemas and inferred types

packages/shared/src/
  index.ts                  # Browser-safe response contracts
```

## Define the widget contract

### Add a response contract

Put response shapes in `packages/shared/src/index.ts` when the client also consumes them:

```ts title="packages/shared/src/index.ts"
export type Widget = {
  id: string;
  name: string;
};

export type WidgetListResponse = {
  widgets: Widget[];
};

export type WidgetResponse = {
  widget: Widget;
};
```

Use `import type` so these contracts disappear from the compiled JavaScript.

### Create the request schema

Request types come from their Zod schemas rather than a duplicate interface:

```ts title="apps/server/src/schemas/create-widget.ts"
import * as z from "zod";

export const createWidgetSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
});

export type CreateWidget = z.infer<typeof createWidgetSchema>;
```

See [Validation](/build/validation) for bodies, URL parameters, query strings, and validation errors.

## Implement the routes

### Add the route

Declare routes after `express.json()` and before the `/api` catch-all. Use `validate()` before the handler and read its parsed output from `res.locals.validated`:

```ts title="apps/server/src/app.ts"
import type { WidgetResponse } from "@mern/shared";
import { validate } from "./middleware/validate.ts";
import {
  type CreateWidget,
  createWidgetSchema,
} from "./schemas/create-widget.ts";

app.post(
  "/api/widgets",
  validate({ body: createWidgetSchema }),
  async (_req, res) => {
    const input: CreateWidget = res.locals.validated.body;
    const widget = await Widget.create(input);

    res.status(201).json({
      widget: { id: widget.id, name: widget.name },
    } satisfies WidgetResponse);
  },
);
```

The handler never returns to the original `req.body`. Zod's trimmed, coerced, defaulted, or transformed output is the value passed to the database.

Express 5 forwards rejected promises from async handlers to the central error handler, so a normal database call does not need a wrapper or repetitive `try/catch`.

### Read data

Response contracts also keep read endpoints aligned with the client:

```ts title="apps/server/src/app.ts"
import type { WidgetListResponse } from "@mern/shared";

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

`satisfies` checks the JSON shape without changing the inferred type of the value.

### Protect a route

If widgets belong to signed-in users, add `ownerId` to the model, set it when creating a widget, and filter reads by that ID. Use `authMiddleware(auth)` when a route is private:

```ts
app.get("/api/widgets/mine", authMiddleware(auth), async (_req, res) => {
  const ownerId = res.locals.session.user.id;
  const widgets = await Widget.find({ ownerId }).lean();
  res.json({ widgets: widgets.map((widget) => ({
    id: widget._id.toString(), name: widget.name,
  })) } satisfies WidgetListResponse);
});
```

An unauthenticated request stops at `authMiddleware` and never reaches the handler. See [Authentication](/build/authentication) for sessions and protected routes.

### Extract a router when needed

Once a feature has several endpoints, move them together:

```ts title="apps/server/src/routes/widgets.ts"
import { Router } from "express";

export const widgetsRouter = Router();

widgetsRouter.get("/", listWidgets);
widgetsRouter.post("/", validate({ body: createWidgetSchema }), createWidget);
```

Mount the router before the API 404 handler:

```ts title="apps/server/src/app.ts"
app.use("/api/widgets", widgetsRouter);
```

## Call the route from the client

```ts title="apps/client/src/lib/widgets.ts"
import type { WidgetResponse } from "@mern/shared";
import axios from "axios";

export async function createWidget(name: string) {
  const { data } = await axios.post<WidgetResponse>("/api/widgets", { name });
  return data;
}
```

Axios sends JSON objects and rejects non-2xx responses by default. The caller can handle rejected requests and display an appropriate message.

## Verify

Add a Supertest integration test for the success response and every meaningful rejected boundary, then run:

```sh
pnpm test:integration
pnpm typecheck
pnpm check
```

## Next step

Continue to [Client pages](/build/client-pages) to display the widget list.

## References

- [Express routing](https://expressjs.com/en/guide/routing.html)
- [Express error handling](https://expressjs.com/en/guide/error-handling.html)
- [Validation](/build/validation)
- [Middleware](/build/middleware)
- [Database](/build/database)
- [Authentication](/build/authentication)
