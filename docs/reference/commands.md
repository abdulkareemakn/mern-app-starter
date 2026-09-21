---
title: Commands
description: Every script in the root package.json, what it runs, and when to use it.
---

# Commands

All commands run from the repository root unless noted.

## Root scripts

These are the root scripts currently provided by `package.json`.

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the client and server through Portless |
| `pnpm build` | Build the client and compile the server |
| `pnpm start` | Run the compiled server |
| `pnpm typecheck` | Generate route types and check all packages |
| `pnpm check` | Check formatting and lint rules |
| `pnpm format` | Apply formatting and safe lint fixes |
| `pnpm test` | Run unit tests followed by API integration tests |
| `pnpm test:unit` | Run all tests in `tests/unit/` |
| `pnpm test:integration` | Run all tests in `tests/integration/` |
| `pnpm test:e2e` | Run Playwright tests in Chromium |
| `pnpm test:e2e:ui` | Open Playwright's interactive test UI |
| `pnpm db:up` / `pnpm db:down` | Start or stop local MongoDB |
| `pnpm docker:up` / `pnpm docker:down` | Build/start or stop the complete stack |

## Per-package scripts

Package-level commands are useful when working on one workspace:

```sh
pnpm --filter @mern/client generate-routes
```

## Test databases

Integration tests create and delete a random `mern_test_*` database. E2E tests use a
random `mern_e2e_*` database. Both need permission to create and drop temporary
databases and never use the application database.
