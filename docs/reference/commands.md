---
title: Commands
description: Every script in the root package.json, what it runs, and when to use it.
---

# Commands

TODO: Introduce the page — all commands run from the repository root.

## Root scripts

TODO: Keep this table in sync with the root `package.json`.

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the client and server through Portless |
| `pnpm build` | Build the client and compile the server |
| `pnpm start` | Run the compiled server |
| `pnpm typecheck` | Generate route types and check all packages |
| `pnpm check` | Check formatting and lint rules |
| `pnpm format` | Apply formatting and safe lint fixes |
| `pnpm test` | Check configuration validation without MongoDB |
| `pnpm test:integration` | Check auth flows against MongoDB |
| `pnpm db:up` / `pnpm db:down` | Start or stop local MongoDB |
| `pnpm docker:up` / `pnpm docker:down` | Build/start or stop the complete stack |

## Per-package scripts

TODO: Document the package-level commands:

```sh
pnpm --filter @mern/client generate-routes
```

## Test databases

TODO: Explain again that the integration check creates and deletes its own randomly
named `mern_test_*` database, needs permission to create and drop it, and never drops
the application database.
