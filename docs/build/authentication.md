---
title: Authentication
description: Configure Better Auth for email/password auth, use its session on the server, and keep protected UI in sync with server authorization.
---

# Authentication with Better Auth

This starter kit uses [Better Auth](https://better-auth.com) for authentication. It's widely considered the best TypeScript auth library available. It's free, open source, and you keep full control of your data. Better Auth handles users, accounts, sessions, and verification records through its MongoDB adapter. Keep your application data in separate Mongoose models; don't create a competing `User` model or write directly to Better Auth collections.

## Environment

Add these to `.env` at the repository root:

```bash
APP_URL=https://mern.localhost
BETTER_AUTH_URL=https://mern.localhost

# Generate with: openssl rand -base64 32
BETTER_AUTH_SECRET=
```

`APP_URL` and `BETTER_AUTH_URL` must match exactly in this same-origin template. `BETTER_AUTH_SECRET` must be at least 32 characters. Generate it once and keep it private.

## Project structure

```
apps/server/src/
  auth.ts           # Better Auth server instance + plugin config
  middleware/
    auth.ts         # Express middleware: authMiddleware
  routes/
    auth.ts         # Mounts Better Auth handler at /api/auth/*

apps/client/src/
  lib/
    auth-client.ts  # Better Auth client with inferred types
  hooks/
    use-session.ts  # React hook for session state
```

## Server configuration

The server creates the Better Auth instance in `apps/server/src/auth.ts`:

```ts
// apps/server/src/auth.ts
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { database } from "./database";

export const auth = betterAuth({
  database: mongodbAdapter(database),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  // Add plugins here:
  // magicLink: { enabled: true },
  // oAuth2: { github: { clientId: "...", clientSecret: "..." } },
});
```

## Client configuration

The client lives in `apps/client/src/lib/auth-client.ts` and infers types from the server config:

```ts
// apps/client/src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_APP_URL,
});
```

## Using sessions in components

The `useSession` hook (in `apps/client/src/hooks/use-session.ts`) gives you reactive session state:

```tsx
import { useSession } from "@/hooks/use-session";

function Profile() {
  const { data: session, isPending } = useSession();

  if (isPending) return <Skeleton />;
  if (!session) return <SignInPrompt />;

  return <div>Welcome, {session.user.name}</div>;
}
```

## Authentication middleware

Protect Express routes with `authMiddleware`:

```ts
// apps/server/src/routes/user.ts
import { authMiddleware } from "../middleware/auth";
import { auth } from "../auth";

app.get("/api/me", authMiddleware(auth), (_req, res) => {
  res.json({ user: res.locals.session.user });
});

```

- `authMiddleware(auth)` reads cookies, returns `401` if no valid session, and attaches `res.locals.session`.
- `adminMiddleware` checks for the `admin` role on the session; returns `403` for authenticated non-admins.

See [Middleware](/build/middleware) for the full implementation.

## Reference

- [Better Auth Docs](https://better-auth.com/docs)
- [Better Auth Plugin Reference](https://better-auth.com/docs/plugins)
- [Better Auth React Client](https://better-auth.com/docs/client/react)
