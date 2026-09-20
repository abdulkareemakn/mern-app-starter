---
title: Install
description: Install dependencies, generate the Better Auth secret, start MongoDB, and open the app.
---

# Install

After this page, the client is available at
[https://mern.localhost](https://mern.localhost), the API is proxied through it,
and MongoDB is running in Docker.

## Install dependencies

```sh
pnpm install
```

Run this from the repository root. pnpm installs all workspace packages and
uses the checked-in lockfile to keep dependency versions consistent.

## Create your environment file

--8<-- "includes/environment-setup.md"

The example uses local MongoDB. To use MongoDB elsewhere, replace
`MONGODB_URI` in `.env` with that connection string and skip the local database
step below.

## Start MongoDB

```sh
pnpm db:up
```

This runs `compose.db.yaml`, stores data in the `mongo-data` Docker volume, and
publishes MongoDB on `127.0.0.1:27017`. Stop it with `pnpm db:down` when you are
finished.

## Run the client and server

```sh
pnpm dev
```

The root command starts the client, API, and email preview through Portless:

- client: [https://mern.localhost](https://mern.localhost)
- API: [https://api.mern.localhost](https://api.mern.localhost)
- email preview: [https://emails.localhost](https://emails.localhost)
- MailDev inbox: [https://mail.localhost](https://mail.localhost)

On its first run, Portless creates a local certificate authority and may ask to
trust it. Run `pnpm exec portless trust` later if you skip the prompt.

To start only one app, use `pnpm --filter @mern/client dev` or
`pnpm --filter @mern/server dev`.

## Verify the setup

Open [https://mern.localhost](https://mern.localhost), create an account, and
select **Test protected API** after signing in. The client proxies `/api` to
Express, so use the client URL rather than the API URL for browser testing.

## Next steps

Next, read [Project structure](/installation/project-structure).
