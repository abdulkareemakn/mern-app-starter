---
title: Protect a route
description: Require a session on the server for an endpoint, and handle signed-out users in the client.
---

# Protect a route

TODO: Introduce the guide — protecting data in the UI is not enough; enforce it on the
server.

## 1. Read the session in the handler

TODO: Show the pattern from `GET /api/me`, using `auth.api.getSession` with
`fromNodeHeaders(req.headers)`, returning 401 and an `ApiError` when there is no session:

```ts
const session = await auth.api.getSession({
  headers: fromNodeHeaders(req.headers),
});
if (!session) {
  res.status(401).json({ error: "Sign in to continue" } satisfies ApiError);
  return;
}
```

## 2. Use the session data

TODO: Show narrowing to the fields the contract exposes rather than returning the whole
session object.

## 3. Handle it in the client

TODO: Show checking `authClient.useSession()` before rendering protected UI, and the
"cannot load your session" error state from `apps/client/src/routes/index.tsx`.

## 4. Understand why both layers exist

TODO: Explain that hiding UI is a courtesy and the server check is the actual control.

## 5. Verify

TODO: Give the check: call the endpoint signed out and confirm a 401, then signed in and
confirm the payload. Mention the integration suite (`pnpm test:integration`) covers this
behaviour.
