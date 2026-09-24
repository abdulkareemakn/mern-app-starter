---
title: Validation
description: Validate request data with Zod before application code uses it.
---

# Validation

This starter kit uses Zod to check data at the Express boundary. Browser forms help people enter valid values, but any client can send an API request. A schema checks the value at runtime and supplies its TypeScript type.

The example feature throughout this section is a widget with a name. The starter already includes a separate `create-user.ts` example and `/api/example/users` route; the widget code below is a guide to add, not an endpoint that ships today.

## Define a request schema

Create `apps/server/src/schemas/create-widget.ts`:

```ts
import * as z from "zod";

export const createWidgetSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
});

export type CreateWidget = z.infer<typeof createWidgetSchema>;
```

The inferred type describes parsed output.

## Validate the route

`validate()` in `apps/server/src/middleware/validate.ts` accepts `body`, `params`, and `query` schemas. It sends HTTP `400` with `{ error, details }` on failure. On success, it places parsed values in `res.locals.validated`:

```ts
app.post(
  "/api/widgets",
  validate({ body: createWidgetSchema }),
  async (_req, res) => {
    const input: CreateWidget = res.locals.validated.body;
    const widget = await Widget.create(input);
    res.status(201).json({ widget: { id: widget.id, name: widget.name } });
  },
);
```

Use the parsed value. Reading `req.body` again loses trimming, defaults, coercion, and any other schema transforms.

## Validate other request values

Parameters and search values arrive as strings. Pass schemas for them when the route uses them:

```ts
const widgetParamsSchema = z.object({ id: z.string().min(1) });
const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
});

app.get(
  "/api/widgets/:id",
  validate({ params: widgetParamsSchema, query: listQuerySchema }),
  (_req, res) => res.json(res.locals.validated),
);
```

That last handler illustrates parsed values, not a widget lookup. Implement the database query and response contract before publishing such a route. Express 5 exposes `req.query` through a getter, so the middleware stores parsed data in `res.locals` rather than replacing `req.query`.

## Handle errors and types

Validation failures identify the target, such as `Invalid request body`, and format Zod issues with `z.flattenError()`. Inline handlers infer the parsed type from `validate()`. If a handler is extracted, use `ValidatedLocals<typeof schemas>` from the same middleware instead of duplicating the request shape.

Mongoose constraints still protect writes from other code paths.

## Verify

Add an integration check for a valid widget name and for whitespace-only input. Confirm that the saved name is trimmed and the invalid request never writes a record. Then run `pnpm test:integration` and `pnpm typecheck`.

## Next step

Continue to [API routes](/build/api-routes) to write and read widgets through Express.

## References

- [Zod basics](https://zod.dev/basics)
- [Zod error formatting](https://zod.dev/error-formatting)
- [Express middleware](/build/middleware)
- [API routes](/build/api-routes)
