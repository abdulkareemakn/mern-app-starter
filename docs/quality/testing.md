---
title: Testing
description: Test schemas, API behavior, authentication, and complete browser workflows with Vitest, Supertest, and Playwright.
---

# Testing

This repository uses three test layers, organized under one root directory:

```text
tests/
├── unit/                         # Fast, isolated server tests
├── integration/                  # Express/API tests
└── e2e/                          # Full browser workflows
    ├── auth.spec.ts
    ├── not-found.spec.ts
    ├── server.ts                 # Temporary Express server for Playwright
    └── teardown.ts               # Removes the E2E database after the run
```

The layers are intentionally different. Unit tests are the cheapest feedback.
Integration tests verify that server components work together. End-to-end tests verify
that a real user can complete important workflows through the browser.

## Test commands

Run commands from the repository root.

| Command | What it runs |
| --- | --- |
| `pnpm test` | Unit tests followed by API integration tests |
| `pnpm test:unit` | All tests in `tests/unit/` |
| `pnpm test:integration` | All tests in `tests/integration/` |
| `pnpm test:e2e` | Playwright tests in Chromium |
| `pnpm test:e2e:ui` | Playwright's interactive test UI |
| `pnpm exec playwright test --list` | Lists discovered E2E tests without running them |

`pnpm test` does not run E2E tests. E2E tests start two application processes, require
a browser, and use MongoDB, so they are kept as an explicit, slower check.

## Unit tests

Location: `tests/unit/`

Unit tests use Vitest and do not start an HTTP server or require MongoDB.

Current coverage includes:

- `config.test.ts`
  - Parses valid application configuration.
  - Applies defaults and transforms values such as `PORT` and `TRUST_PROXY`.
  - Rejects invalid ports, URLs, environments, MongoDB URLs, secrets, and public URL combinations.
  - Requires `TEST_MONGODB_URI` when running in test mode.
  - Confirms test mode uses `TEST_MONGODB_URI` instead of `MONGODB_URI`.
  - Requires the production email credential in production mode.
- `schemas.test.ts`
  - Confirms valid user input is normalized.
  - Confirms invalid names, emails, and ages produce structured validation errors.
- `email-client.test.ts`
  - Confirms non-production email is sent through the local SMTP inbox configuration.

Use unit tests for pure functions, configuration parsing, schemas, and other logic that
can be tested without assembling the server.

## API integration tests

Location: `tests/integration/`

API integration tests use Vitest and Supertest. They call Express application instances
directly, so they exercise routing, middleware, validation, authentication, and database
behavior without starting a network listener.

Current coverage includes:

- `api.test.ts`
  - Accepts a valid example user.
  - Returns structured errors for invalid request bodies.
  - Returns JSON errors for unknown API routes and malformed JSON.
- `validation.test.ts`
  - Validates and normalizes request bodies.
  - Validates route parameters and query strings.
  - Validates multiple request targets on one route.
  - Prevents invalid requests from reaching route handlers.
- `auth.test.ts`
  - Creates a random test database.
  - Signs a user up through Better Auth.
  - Reads the authenticated session.
  - Signs out and verifies the session is revoked.
  - Drops the test database during teardown.

Use integration tests when several server pieces must work together but browser behavior
is not part of the requirement.

## End-to-end tests

Location: `tests/e2e/`

E2E tests use Playwright against Chromium. The Playwright configuration starts both parts
of the application:

1. `tests/e2e/server.ts` starts Express on `127.0.0.1:3001`.
2. Vite starts the React client on `localhost:4173`.
3. Playwright drives the browser against the client.
4. The browser reaches the real Express API and MongoDB.
5. `tests/e2e/teardown.ts` removes the random E2E database after the run.

Current workflows include:

- `auth.spec.ts`
  - Opens the application.
  - Switches from sign-in to sign-up.
  - Creates a unique user.
  - Verifies the authenticated welcome page.
  - Calls the protected API from the UI.
  - Signs out and verifies the sign-in page.
- `not-found.spec.ts`
  - Opens an unknown client URL.
  - Verifies the 404 page.
  - Follows the link back home.
  - Verifies the home page loads.

Playwright retains traces and captures screenshots when an E2E test fails. These
artifacts are written under `test-results/` and are uploaded by CI when available.

## Local prerequisites

The project requires Node.js 24 or newer and pnpm.

### MongoDB

Integration and E2E tests require a dedicated MongoDB server. On Windows, use the
MongoDB service installed with Community Server. On macOS and Linux, start the local
container with:

```bash
pnpm db:up
```

Then set this variable in the root `.env` file:

```dotenv
TEST_MONGODB_URI=mongodb://127.0.0.1:27017
```

Test mode deliberately does not fall back to `MONGODB_URI`. This prevents tests from
accidentally modifying the development database.

Each persistence test run uses a random database name:

- Integration tests use `mern_test_<random-id>`.
- E2E tests use `mern_e2e_<random-id>`.

The tests drop their databases during cleanup. The MongoDB user configured by
`TEST_MONGODB_URI` therefore needs permission to create and drop databases.

### Playwright browser

Install Chromium once per environment:

```bash
pnpm exec playwright install chromium
```

CI installs the browser and its system dependencies with:

```bash
pnpm exec playwright install --with-deps chromium
```

## Running tests during development

Use the cheapest applicable layer while iterating:

```bash
# Pure logic or schema change
pnpm test:unit

# Express route, middleware, auth, or database change
pnpm test:integration

# Browser, client routing, cookies, client/API wiring, or full workflow change
pnpm test:e2e
```

Before opening a pull request or finishing a substantial change, run the relevant fast
suite and then the broader suites:

```bash
pnpm test
pnpm test:e2e
```

To run a single Playwright file:

```bash
pnpm exec playwright test auth.spec.ts
```

To debug it interactively:

```bash
pnpm exec playwright test auth.spec.ts --ui
```

## Test configuration

### Vitest

The server package owns the Vitest dependency, but the tests now live in the root
`tests/` directory. The server package scripts therefore run Vitest with the repository
root as its project root:

```text
vitest run --root ../.. --config vitest.config.ts tests/unit
vitest run --root ../.. --config vitest.config.ts tests/integration
```

`vitest.config.ts` resolves dependencies installed in `apps/server/node_modules` so
root-level tests can import server dependencies such as Express, Mongoose, Supertest,
Zod, Better Auth, Nodemailer, and Resend.

Do not remove the `--root`, `--config`, or resolver configuration without verifying that
tests still discover files under `tests/` and can resolve the server package
dependencies.

### Playwright

`playwright.config.ts` is responsible for:

- Discovering tests under `tests/e2e/`.
- Requiring `TEST_MONGODB_URI` before the run starts.
- Creating the random `E2E_DB_NAME`.
- Starting the API and client web servers.
- Setting the browser base URL to `http://localhost:4173`.
- Running one Chromium worker at a time because the E2E database is shared by the run.
- Retaining traces on failure and screenshots only on failure.
- Running the E2E database teardown after the suite.

## CI behavior

The testing workflow is defined in `.github/workflows/testing.yaml` and runs on pushes
and pull requests.

CI has three jobs:

1. **Unit tests** install dependencies and run `pnpm test:unit`.
2. **Integration tests** start MongoDB 8 as a service, set `TEST_MONGODB_URI`, and run
   `pnpm test:integration`.
3. **E2E tests** start MongoDB 8, install Chromium with system dependencies, run
   `pnpm test:e2e`, and upload Playwright artifacts from `test-results/`.

The integration and E2E jobs are separate so a failure in one layer is easy to identify
and so the fast unit job can finish independently.

## Adding a test

Choose the narrowest layer that proves the behavior:

- Add a file under `tests/unit/` when the behavior is isolated and does not need an app,
  database, browser, or HTTP request.
- Add a file under `tests/integration/` when the behavior involves Express routes,
  middleware, authentication, or MongoDB but not the browser.
- Add a file under `tests/e2e/` only when the behavior depends on the complete
  client/server/browser workflow.

Keep test data isolated, avoid depending on execution order, and use unique values for
persisted records. For database-backed tests, clean up the database even when the test
fails.

The goal is not to duplicate every assertion at every layer. Test details at the lowest
useful layer, then reserve E2E coverage for a small number of workflows that prove the
system is wired together correctly.

## Troubleshooting

### `TEST_MONGODB_URI` is required

Set `TEST_MONGODB_URI` in the root `.env` file or export it in the shell. Do not use
only `MONGODB_URI`; test mode intentionally rejects that fallback.

### Chromium is missing

Run:

```bash
pnpm exec playwright install chromium
```

### E2E server health check times out

Check that port `3001` is available and that MongoDB is running. The API process must
answer `http://127.0.0.1:3001/api/health` before Playwright begins.

### Playwright shows no tests

Run:

```bash
TEST_MONGODB_URI=mongodb://127.0.0.1:27017 pnpm exec playwright test --list
```

The expected result currently lists the authentication workflow and the 404 workflow
from `tests/e2e/`.

### A test database remains after a failed run

The normal teardown removes the random database. If a process is terminated before
teardown runs, inspect MongoDB for databases beginning with `mern_test_` or
`mern_e2e_` and remove only the test database that belongs to the failed run.

## Reference

- [Vitest](https://vitest.dev/)
- [Supertest](https://github.com/forwardemail/supertest)
- [Playwright](https://playwright.dev/)
- [Validation](/build/validation)
- [API routes](/build/api-routes)
- [Database](/build/database)
