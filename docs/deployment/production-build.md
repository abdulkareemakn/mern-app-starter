---
title: Production build
description: Build the workspace and run the Express server that serves both the API and React app.
---

# Production build

In production, one Express process serves the built React app and its `/api` routes from
the same origin. Build from the repository root, then point your HTTPS proxy or
platform at that process.

## Build

```sh
pnpm build
```

This builds the client into `apps/client/dist` and compiles the server into
`apps/server/dist`. The client build also generates
the TanStack Router route types it needs.

## Configure for production

Set these values in the root `.env` or in your hosting platform's environment settings:

```dotenv
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://...
APP_URL=https://app.example.com
BETTER_AUTH_URL=https://app.example.com
BETTER_AUTH_SECRET=replace-with-a-random-secret-at-least-32-characters-long
```

Generate the secret once with `openssl rand -base64 32`. `APP_URL` and
`BETTER_AUTH_URL` must be the identical public HTTPS origin. See
[environment variables](/configuration/environment-variables) for the full reference.

## Run

```sh
pnpm start
```

`pnpm start` runs the compiled server. It listens on port 3001 unless `PORT` is set,
serves `apps/client/dist`, and falls back to the SPA for browser routes. Your public
URL must reach this server directly or through a reverse proxy.

## Verify

After MongoDB connects, the health endpoint returns HTTP 200 and `ok`:

```sh
curl https://app.example.com/api/health
```

```json
{ "status": "ok" }
```

If it returns `503`, check the MongoDB URL, network access, and database credentials.
