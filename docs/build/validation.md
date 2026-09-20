---
title: Validation
description: Validate Express request bodies, URL parameters, and query strings with reusable Zod 4 middleware.
---

# Request validation with Zod

Every value sent by a client is untrusted. This starter uses [Zod 4](https://zod.dev/) at the API boundary and a small `validate()` middleware so route handlers only receive parsed data.

The schema is the single source of truth: it performs runtime validation and produces the TypeScript type.

## Project structure

```text
apps/server/src/
  middleware/
    validate.ts             # Reusable body, params, and query validation
  schemas/
    create-user.ts          # Schema and inferred output type
  app.ts                    # Routes use validate(...)
```

## Create a schema

Keep request schemas in `apps/server/src/schemas/`:

```ts title="apps/server/src/schemas/create-user.ts"
import * as z from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Enter a valid email address"),
  age: z.number().int().min(13, "Age must be at least 13"),
});

export type CreateUser = z.infer<typeof createUserSchema>;
```

Do not repeat this shape as a separate request interface. `CreateUser` is Zod's parsed output type and stays synchronized with the schema.

## Validate a request body

Pass the schema to `validate()` and use `res.locals.validated.body` in the handler:

```ts title="apps/server/src/app.ts"
app.post(
  "/api/example/users",
  validate({ body: createUserSchema }),
  (_req, res) => {
    const user: CreateUser = res.locals.validated.body;
    res.status(201).json({ user });
  },
);
```

The middleware calls `next()` only after validation succeeds. Invalid data receives a `400 Bad Request` response and never reaches the handler.

## Use parsed output

Always read from `res.locals.validated`, not the original `req.body`, `req.params`, or `req.query`. Zod may change the value while parsing:

```ts
const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  search: z.string().trim().optional(),
});
```

For `?page=2&search=%20Ada%20`, the handler receives:

```ts
{ page: 2, search: "Ada" }
```

That preserves coercion, trimming, defaults, transforms, and stripped keys instead of returning to untrusted request values.

## Validate URL parameters

Express URL parameters start as strings. Coerce them when the application needs another type:

```ts
export const userParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

app.get(
  "/api/users/:id",
  validate({ params: userParamsSchema }),
  (_req, res) => {
    const { id } = res.locals.validated.params; // number
    res.json({ id });
  },
);
```

## Validate query parameters

```ts
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

app.get(
  "/api/users",
  validate({ query: paginationSchema }),
  (_req, res) => listUsers(res.locals.validated.query),
);
```

## Validate multiple inputs

One middleware call can validate several request targets:

```ts
app.patch(
  "/api/users/:id",
  validate({
    params: userParamsSchema,
    body: updateUserSchema,
  }),
  (_req, res) => {
    const { id } = res.locals.validated.params;
    const updates = res.locals.validated.body;
    res.json({ id, updates });
  },
);
```

Use the same form for `body`, `params`, and `query`; there is no route-level `safeParse()` to repeat.

## Validation errors

The middleware uses Zod 4's `z.flattenError()` and identifies the failed request target:

```json
{
  "error": "Invalid request body",
  "details": {
    "formErrors": [],
    "fieldErrors": {
      "email": ["Enter a valid email address"]
    }
  }
}
```

Parameter and query failures use `Invalid request params` and `Invalid request query`. Validation responses are produced by the middleware; unexpected errors continue to the central Express error handler.

## TypeScript inference

Inline route handlers infer `res.locals.validated` from the schemas passed to `validate()`. Zod transformations infer their output type, not their original input type.

Express cannot always carry a middleware's generic type into a separately declared handler. If you extract the handler, export the schema object and use `ValidatedLocals<typeof schemas>` from `middleware/validate.ts`. This still derives the type from Zod and does not duplicate the request shape.

## Test validation

Use Supertest to send real HTTP input through Express. Cover:

- a valid request;
- each important invalid boundary;
- parsed output such as trimming, coercion, or defaults;
- routes that validate more than one target; and
- confirmation that invalid data never reaches the handler.

```sh
pnpm test:integration
pnpm typecheck
```

Database constraints remain a useful second line of defence for every write path. They do not replace request validation because other services may consume the value first, and database errors do not provide a consistent client response.

## Reference

- [Zod basics](https://zod.dev/basics)
- [Zod error formatting](https://zod.dev/error-formatting)
- [API routes](/build/api-routes)
- [Middleware](/build/middleware)
