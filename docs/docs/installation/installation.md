---
title: Install
description: Install dependencies, generate the Better Auth secret, start MongoDB, and open the app.
---

# Install

This starter kit runs four local services on fixed localhost ports. After this page, the client is available at
[http://localhost:3000](http://localhost:3000), the API is proxied through it,
and MongoDB is running locally.

## Install dependencies

```sh
pnpm install
```

Run this from the repository root. pnpm installs all workspace packages and
uses the checked-in lockfile to keep dependency versions consistent.

## Create your environment file

Create `.env` now using the Windows-first commands and Node.js secret generator in [Development workflow](/installation/development-workflow/#environment-variables), then return to this page. The example uses local
MongoDB. To use MongoDB elsewhere, replace `MONGODB_URI` in `.env` with that
connection string and skip the local database step below.

## Start MongoDB

=== "Windows"

    The MongoDB Community Server installer starts the `MongoDB` Windows service. No
    Docker command is needed. If it has been stopped, start it from **Services** or
    run PowerShell as an administrator:

    ```powershell
    Start-Service MongoDB
    ```

=== "macOS / Linux"

    ```sh
    pnpm db:up
    ```

    This runs `compose.db.yaml`, stores data in the `mongo-data` Docker volume, and
    publishes MongoDB on `127.0.0.1:27017`. Stop it with `pnpm db:down` when you are
    finished.

## Run the client and server

```sh
pnpm dev
pnpm dev:ui
```

Run the commands in separate terminals:

- client: [http://localhost:3000](http://localhost:3000) via `pnpm dev:ui`
- API: [http://localhost:3001](http://localhost:3001) via `pnpm dev`
- MailDev inbox: [http://localhost:3003](http://localhost:3003) via `pnpm dev`
- local SMTP: `localhost:3025` via `pnpm dev`
- optional email preview: [http://localhost:3002](http://localhost:3002) via `pnpm dev:mail`

Press Ctrl+C in either terminal to stop that command. Vite's interactive keyboard commands are available in the `pnpm dev:ui` terminal.

## Verify the setup

Open [http://localhost:3000](http://localhost:3000), create an account, and
select **Test protected API** after signing in. The client proxies `/api` to
Express, so use the client URL rather than the API URL for browser testing.

## Next steps

Next, read [Development workflow](/installation/development-workflow) for the daily commands, then [Project structure](/installation/project-structure) to find the code.

## References

- [pnpm installation](https://pnpm.io/installation)
- [Development workflow](/installation/development-workflow)
