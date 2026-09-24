---
title: Development workflow
description: The commands you run while building, including dev servers, type checking, formatting, and tests.
---

# Development workflow

This starter kit gives each local service a fixed localhost port and keeps interactive tools in separate terminals. Return to this page while you work. The normal loop is simple: run the app,
make one focused change, check it, then run the smallest test that can prove it works.

## Environment variables

The root `.env` file holds settings that change between your computer, tests, and a
production host. Copy the safe template once:

=== "Windows PowerShell"

    ```powershell
    Copy-Item .env.example .env
    ```

=== "macOS / Linux"

    ```sh
    cp .env.example .env
    ```

Generate a value for `BETTER_AUTH_SECRET` and paste it into `.env`:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

`MONGODB_URI` identifies the application database. `TEST_MONGODB_URI` is deliberately
separate because test runs create and remove temporary databases. `APP_URL` and
`BETTER_AUTH_URL` must be the same public origin in this starter. Do not put a secret,
database URL, or API key in a variable beginning with `VITE_`: Vite exposes those to
browser code.

!!! warning "Keep `.env` private"

    Commit `.env.example`, never `.env`. Production hosts should inject the same values
    through their secret settings instead of copying a development file.

## Start the workspace

```sh
pnpm dev
pnpm dev:ui
```

Run these commands in separate terminals:

- `pnpm dev`: API on `http://localhost:3001`, MailDev inbox on `http://localhost:3003`, and SMTP on `localhost:3025`
- `pnpm dev:ui`: interactive Vite client on `http://localhost:3000`
- `pnpm dev:mail`: optional React Email preview on `http://localhost:3002`

Each command owns its terminal. Press Ctrl+C there to stop its processes; Vite's keyboard commands work in the `pnpm dev:ui` terminal.

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
pnpm test:e2e
```

`pnpm test` runs the Vitest unit suite followed by the API integration suite.
`pnpm test:e2e` runs the Playwright browser suite. Integration and E2E tests use
separate randomly named databases when persistence is required. See
[Commands](/reference/commands) and [Testing](/quality/testing) for the current test
commands and database setup.

## Build and run

```sh
pnpm build
pnpm start
```

`pnpm build` builds the client and server. `pnpm start` runs the compiled
server; use the Docker commands in [Deployment](/deployment) for the complete
production-style stack.

## Next step

Continue to [Project structure](/installation/project-structure) to locate the code each command affects.

## References

- [Node environment files](https://nodejs.org/api/environment_variables.html#env-files)
- [Vite environment variables](https://vite.dev/guide/env-and-mode)
- [Commands](/reference/commands)
- [Testing](/quality/testing)
