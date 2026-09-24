---
title: Middleware
description: Compose Express middleware for authentication, Zod request validation, and centralized error handling.
---

# Express middleware

The starter kit uses Express middleware for work shared by several routes before the final handler runs. The starter keeps reusable middleware in `apps/server/src/middleware/` and uses `res.locals` for request-scoped, trusted data.

## Request flow

### Project structure

```text
apps/server/src/
  app.ts
  middleware/
    auth.ts         # Validates the Better Auth session
    validate.ts     # Parses body, params, and query with Zod
```

### Execution order

The request flow is:

```text
request
  ↓
Express middleware
  ↓
route middleware
  ├─ authMiddleware(...)  → unauthenticated: 401
  └─ validate({ ... })    → invalid: 400
  ↓
route handler
  ↓
central error handler     → unexpected failure: 500
```

Middleware runs in registration order. It either sends a response and stops, or calls `next()` to continue.

## Application middleware order

The order in `apps/server/src/app.ts` is intentional:

```ts
// Better Auth needs the untouched request body.
app.all("/api/auth/{*path}", toNodeHandler(auth));

app.use(express.json({ limit: "100kb" }));

// Application routes go here.

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API route not found" });
});

app.use(handleError);
```

Keep Better Auth before `express.json()`. Add application routes after the JSON parser and before the API 404 handler. The four-argument error handler belongs last.

## Route guards

### Authentication middleware

`authMiddleware(auth)` validates the session and exposes it as `res.locals.session`:

```ts title="apps/server/src/middleware/auth.ts"
import type { ApiError } from "@mern/shared";
import { fromNodeHeaders } from "better-auth/node";
import type { RequestHandler } from "express";
import type { createAuth } from "../auth.ts";

export type AuthenticatedLocals = {
  session: NonNullable<
    Awaited<ReturnType<ReturnType<typeof createAuth>["api"]["getSession"]>>
  >;
};

export function authMiddleware(
  auth: ReturnType<typeof createAuth>,
): RequestHandler<never, unknown, never, never, AuthenticatedLocals> {
  return async (req, res, next) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      res.status(401).json({ error: "Sign in to continue" } satisfies ApiError);
      return;
    }

    res.locals.session = session;
    next();
  };
}
```

Use it directly on a private route:

```ts
app.get("/api/me", authMiddleware(auth), (_req, res) => {
  const { id, name, email } = res.locals.session.user;
  res.json({ user: { id, name, email } });
});
```

See [Authentication](/build/authentication) for the complete auth flow.

### Validation middleware

`validate()` accepts any combination of Zod schemas for `body`, `params`, and `query`:

```ts
app.patch(
  "/api/users/:id",
  validate({
    params: userParamsSchema,
    body: updateUserSchema,
  }),
  (_req, res) => updateUser(res.locals.validated),
);
```

It returns `400` with structured Zod errors when parsing fails. On success, parsed output is stored in `res.locals.validated`. Keeping it in `res.locals` is important because Express 5 exposes `req.query` through a getter and it should not be overwritten.

See [Validation](/build/validation) for schemas, errors, inference, and tests.

### Write a small custom middleware

A middleware has three jobs: inspect the request, stop with a response when necessary, or call `next()` exactly once.

```ts
import type { RequestHandler } from "express";

export const requireJson: RequestHandler = (req, res, next) => {
  if (!req.is("application/json")) {
    res.status(415).json({ error: "Content-Type must be application/json" });
    return;
  }

  next();
};
```

Keep middleware focused. Business logic belongs in the route or feature code, while reusable trust-boundary checks belong here.

## Errors and verification

### Error handling

Express 5 automatically forwards rejected promises from async middleware and handlers to the error middleware. Let unexpected errors reach the central handler; do not expose raw database, dependency, stack, cookie, or request-body details to clients.

Expected failures should be answered where they are understood:

- authentication middleware returns `401`;
- authorization middleware returns `403`;
- validation middleware returns `400`; and
- the API catch-all returns `404`.

The central handler is the fallback for malformed JSON, oversized bodies, and unexpected failures.

### Test middleware

Middleware is best tested through a small Express app with Supertest. Verify both branches: rejected requests return the expected status and accepted requests reach a handler with the expected `res.locals` value.

```sh
pnpm test:integration
pnpm typecheck
```

## References

- [Express middleware guide](https://expressjs.com/en/guide/using-middleware.html)
- [Express error handling](https://expressjs.com/en/guide/error-handling.html)
- [Authentication](/build/authentication)
- [Validation](/build/validation)
- [API routes](/build/api-routes)
