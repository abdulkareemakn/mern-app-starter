---
title: Development workflow
description: The commands you run while building, including dev servers, type checking, formatting, and tests.
---

# Development workflow

Run the commands below from the repository root. The usual loop is: start the
services, make a change, type-check and format it, then run the relevant tests.

## Start the workspace

```sh
pnpm dev
```

This starts the client, API, and email preview through Portless:

- `https://mern.localhost`
- `https://api.mern.localhost`
- `https://emails.localhost`
- `https://mail.localhost`

Portless terminates local TLS while the processes receive plain HTTP. Their names and fixed internal ports are defined in `portless.json`.

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
formatting changes and safe Biome fixes. See [formatting](/quality/formatting),
[linting](/quality/linting), and the official [Biome formatter](https://biomejs.dev/formatter/)
and [linter](https://biomejs.dev/linter/) documentation.

## Run the tests

```sh
pnpm test
pnpm test:integration
```

`pnpm test` runs the Vitest unit suite followed by the API integration suite.
Integration tests use Supertest and create a randomly named `mern_test_*`
database when persistence is required. See [Commands](/reference/commands) and
[Testing](/quality/testing) for the current test commands and database setup.

See [Testing](/quality/testing) for the database and test-data expectations.

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

Next, browse [Build your app](/build) or [Commands](/reference/commands).
