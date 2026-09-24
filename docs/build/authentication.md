---
title: Authentication
description: Configure Better Auth for email/password auth, use its session on the server, and keep protected UI in sync with server authorization.
---

# Authentication with Better Auth

The starter kit uses Better Auth for authentication and authorization. Better Auth was chosen as it's considered the best TypeScript authentication library currently available, is free and open-source and you keep control of your own data.

Better Auth owns users, accounts, sessions, and verification records. Keep application data in separate Mongoose models, and do not create a second authentication `User` model.

## Configure authentication

### Environment

After copying `.env.example` to `.env`, the local URLs are already correct. For a normal
local setup, the only value you need to add is `BETTER_AUTH_SECRET`:

```dotenv
BETTER_AUTH_SECRET=
```

Generate the value with the Node.js command in [Development workflow](/installation/development-workflow/#environment-variables).

Generate it once, paste the result into `.env`, and keep it private. Change the other
values in `.env.example` only when you are using a different MongoDB server, local URL,
or deployment environment. `APP_URL` and `BETTER_AUTH_URL` must match in this
same-origin starter.

### Project structure

```text
apps/server/src/
  auth.ts           # Better Auth server instance and plugin configuration
  middleware/
    auth.ts         # Express session middleware

apps/client/src/
  lib/
    auth-client.ts  # Better Auth client
```

### Server configuration

The server creates the Better Auth instance in `apps/server/src/auth.ts`:

```ts title="apps/server/src/auth.ts"
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";
import type { Config } from "./config.ts";

export function createAuth(config: Config) {
  const db = mongoose.connection.db;
  if (!db) throw new Error("Connect to MongoDB before initializing authentication");

  return betterAuth({
    appName: "MERN starter",
    database: mongodbAdapter(db),
    baseURL: config.authUrl,
    secret: config.secret,
    trustedOrigins: [config.appUrl],
    advanced: { ipAddress: { ipAddressHeaders: ["x-mern-client-ip"] } },
    emailAndPassword: { enabled: true, minPasswordLength: 8, maxPasswordLength: 128 },
    rateLimit: { enabled: true, storage: "database" },
  });
}
```

Keep the existing URL, secret, trusted origin, client IP handling, password limits, and rate limit when you add a feature. The standalone local MongoDB server has no multi-document transactions; use a replica set and pass its client to the adapter if a later feature needs them.

### Client configuration

The client lives in `apps/client/src/lib/auth-client.ts`:

```ts title="apps/client/src/lib/auth-client.ts"
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();
```

## Use sessions

### In components

Use the client where a component needs the current session:

```tsx
import { authClient } from "@/lib/auth-client";

function Profile() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <p role="status">Loading session...</p>;
  if (!session) return <p>Sign in to continue.</p>;

  return <div>Welcome, {session.user.name}</div>;
}
```

### In Express routes

Protect Express routes with `authMiddleware`:

```ts
import { authMiddleware } from "./middleware/auth.ts";

app.get("/api/me", authMiddleware(auth), (_req, res) => {
  const { id, name, email } = res.locals.session.user;
  res.json({ user: { id, name, email } });
});
```

`authMiddleware(auth)` reads the cookie, returns `401` when there is no valid session,
and attaches the session to `res.locals` for the route handler.

See [Middleware](/build/middleware) for the full implementation.

### Handler order and client IP

`apps/server/src/app.ts` mounts `/api/auth/{*path}` before `express.json()` so Better Auth receives the original request body. The client uses the same public origin and sends session cookies with its `/api` requests.

The starter enables database-backed rate limiting. It passes a trusted client IP header built after Express applies the configured `TRUST_PROXY` list. Only set that list to proxies you control.

## Extensions and Plugins

The starter kit is configured with Better Auth's email and password flow. Better Auth provides many plugins for common account features. Add the ones your product needs, then build the matching UI and email flow where applicable.

```ts title="apps/server/src/auth.ts"
import { admin, organization, twoFactor, username } from "better-auth/plugins";

// Inside the existing betterAuth({ ... }) options:
plugins: [
  username(), // A username in addition to email.
  twoFactor(), // Authenticator-app two-factor sign-in.
  organization(), // Workspaces, members, roles, and invitations.
  admin(), // Administrative user-management actions.
],
```

Other common additions include social sign-in, magic links, passkeys, email verification, and password-reset emails.

## Next step

Continue to [Validation](/build/validation) to define trusted input for the widget example.

## References

- [Better Auth MongoDB adapter](https://better-auth.com/docs/adapters/mongo)
- [Better Auth Express integration](https://better-auth.com/docs/integrations/express)
- [Better Auth session management](https://better-auth.com/docs/concepts/session-management)
- [Better Auth React client](https://better-auth.com/docs/client/react)
- [Better Auth plugins](https://better-auth.com/docs/plugins)
