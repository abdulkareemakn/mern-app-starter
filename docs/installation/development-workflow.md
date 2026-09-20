---
title: Development workflow
description: The commands you run while building — dev servers, type checking, formatting, and the test suites.
---

# Development workflow

Run the commands below from the repository root. The usual loop is: start the
services, make a change, type-check and format it, then run the relevant tests.

## Start the workspace

```sh
pnpm dev
```

This starts the client and server through Portless. Open
`https://mern.localhost` or `https://api.mern.localhost`. Portless terminates local TLS while the apps
receive plain HTTP; its names and fixed internal ports are in `portless.json`.

On first use, approve the certificate-authority prompt. If you skip it, run:

```sh
pnpm exec portless trust
```

To run one app only, use `pnpm --filter @mern/client dev` or
`pnpm --filter @mern/server dev`.

To bypass Portless temporarily, run:

```sh
PORTLESS=0 pnpm dev
```

The direct client server uses its usual localhost port. Change
both `APP_URL` and `BETTER_AUTH_URL` to `http://localhost:3000` in `.env` for
this mode. Use `pnpm exec portless doctor` to diagnose certificates, hostname
resolution, routes, and proxy state.

## Type check while you work

```sh
pnpm typecheck
```

This generates TanStack Router route types and runs each package's typecheck
script.

## Format and lint

```sh
pnpm check
pnpm format
```

`pnpm check` reports formatting and lint problems. `pnpm format` writes
formatting changes and safe Biome fixes. See [formatting](/development/formatting),
[linting](/development/linting), and the official [Biome formatter](https://biomejs.dev/formatter/)
and [linter](https://biomejs.dev/linter/) documentation.

## Run the tests

```sh
pnpm test
pnpm test:integration
```

`pnpm test` validates server configuration without MongoDB. The integration
command exercises sign-up, sign-in, sessions, sign-out, and origin protection
against MongoDB using a randomly named `mern_test_*` database. See [Commands](/reference/commands)
and the [Node.js test runner documentation](https://nodejs.org/api/test.html)
for the current test commands and runner.

A dedicated testing guide will be added later.

## Build and preview

```sh
pnpm build
pnpm start
```

`pnpm build` builds the client and server. `pnpm start` runs the compiled
server; use the Docker commands in [Deployment](/deployment) for the complete
production-style stack.

For TypeScript's compiler behavior, see the official
[TypeScript handbook](https://www.typescriptlang.org/docs/handbook/).

## Next steps

Next, browse the [Guides](/guides) or [Commands](/reference/commands).
