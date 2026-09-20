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

Unit tests provide the cheapest feedback. Integration tests verify that server components work together. End-to-end tests verify that a real user can complete important workflows through the browser.

## Commands

Run commands from the repository root.

| Command | Purpose |
| --- | --- |
| `pnpm test` | Run unit tests followed by API integration tests |
| `pnpm test:unit` | Run all tests in `tests/unit/` |
| `pnpm test:integration` | Run all tests in `tests/integration/` |
| `pnpm test:e2e` | Run Playwright tests in Chromium |
| `pnpm test:e2e:ui` | Open Playwright's interactive UI |
| `pnpm exec playwright test --list` | List discovered E2E tests without running them |

`pnpm test` does not run E2E tests. E2E tests start two application processes, require a browser, and use MongoDB, so they remain an explicit slower check.

## Unit tests

Location: `tests/unit/`

Unit tests use Vitest and do not start an HTTP server or require MongoDB.

Current coverage:

- `config.test.ts` checks valid configuration, defaults, transformations, invalid values, test-mode MongoDB requirements, and production email credentials.
- `schemas.test.ts` checks user-input normalization and structured validation errors.
- `email-client.test.ts` checks that non-production email uses the local SMTP inbox configuration.

Use this layer for pure functions, configuration parsing, schemas, and other logic that can be tested without assembling the server.

## API integration tests

Location: `tests/integration/`

These tests use Vitest and Supertest. They call Express application instances directly, exercising routing, middleware, validation, authentication, and database behavior without starting a network listener.

Current coverage:

- `api.test.ts` checks valid users, structured validation errors, unknown API routes, and malformed JSON.
- `validation.test.ts` checks request bodies, route parameters, query strings, multiple request targets, and handler short-circuiting.
- `auth.test.ts` creates a random database, signs up a user through Better Auth, reads the session, signs out, verifies revocation, and drops the database during teardown.

Use integration tests when several server pieces must work together but browser behavior is not part of the requirement.

## End-to-end tests

Location: `tests/e2e/`

E2E tests use Playwright against Chromium. The Playwright configuration starts both application parts:

1. `tests/e2e/server.ts` starts Express on `127.0.0.1:3001`.
2. Vite starts the React client on `localhost:4173`.
3. Playwright drives the browser against the client.
4. The browser reaches the real Express API and MongoDB.
5. `tests/e2e/teardown.ts` removes the random E2E database after the run.

Current workflows:

- `auth.spec.ts` covers sign-up, the authenticated welcome page, the protected API, sign-out, and return to sign-in.
- `not-found.spec.ts` covers an unknown client URL, the 404 page, the home link, and the home page.

Playwright retains traces and captures screenshots when an E2E test fails. CI uploads artifacts from `test-results/` when available.

## Local prerequisites

The project requires Node.js 24 or newer and pnpm.

### MongoDB

Integration and E2E tests require a dedicated MongoDB server. Start the local container with:

```bash
pnpm db:up
```

Set this variable in the root `.env` file:

```dotenv
TEST_MONGODB_URI=mongodb://127.0.0.1:27017
```

Test mode deliberately does not fall back to `MONGODB_URI`, preventing tests from modifying the development database.

Persistence tests use random database names:

- Integration tests: `mern_test_<random-id>`
- E2E tests: `mern_e2e_<random-id>`

The tests drop their databases during cleanup. The MongoDB user configured by `TEST_MONGODB_URI` needs permission to create and drop databases.

### Playwright browser

Install Chromium once per environment:

```bash
pnpm exec playwright install chromium
```

CI installs Chromium and its system dependencies with `pnpm exec playwright install --with-deps chromium`.

## Development workflow

Use the cheapest applicable layer while iterating:

```bash
# Pure logic or schema change
pnpm test:unit

# Express route, middleware, auth, or database change
pnpm test:integration

# Browser, client routing, cookies, client/API wiring, or full workflow change
pnpm test:e2e
```

Before a pull request or substantial change, run the relevant fast suite and then the broader suites:

```bash
pnpm test
pnpm test:e2e
```

Run one Playwright file with `pnpm exec playwright test auth.spec.ts`, or add `--ui` for interactive debugging.

## Test configuration

### Vitest

Vitest is installed in the server package, while tests live in the root `tests/` directory. The server package scripts therefore set the repository root explicitly:

```text
vitest run --root ../.. --config vitest.config.ts tests/unit
vitest run --root ../.. --config vitest.config.ts tests/integration
```

`vitest.config.ts` resolves dependencies installed in `apps/server/node_modules`, including Express, Mongoose, Supertest, Zod, Better Auth, Nodemailer, and Resend. Keep the `--root`, `--config`, and resolver settings aligned if the test layout changes again.

### Playwright

`playwright.config.ts`:

- Discovers tests under `tests/e2e/`.
- Requires `TEST_MONGODB_URI`.
- Creates the random `E2E_DB_NAME`.
- Starts the API and client web servers.
- Uses `http://localhost:4173` as the browser base URL.
- Runs one Chromium worker at a time.
- Retains traces on failure and screenshots only on failure.
- Runs the E2E database teardown after the suite.

## CI behavior

`.github/workflows/testing.yaml` runs on pushes and pull requests with three jobs:

1. **Unit tests** install dependencies and run `pnpm test:unit`.
2. **Integration tests** start MongoDB 8 as a service, set `TEST_MONGODB_URI`, and run `pnpm test:integration`.
3. **E2E tests** start MongoDB 8, install Chromium with system dependencies, run `pnpm test:e2e`, and upload Playwright artifacts.

The jobs are separate so failures are easy to identify and the fast unit job can finish independently.

## Adding tests

Choose the narrowest layer that proves the behavior:

- Put isolated logic in `tests/unit/`.
- Put Express, middleware, authentication, or MongoDB behavior in `tests/integration/`.
- Put complete client/server/browser workflows in `tests/e2e/`.

Keep tests independent of execution order, use unique values for persisted records, and clean up database state. Avoid duplicating every assertion at every layer: test details at the lowest useful layer and reserve E2E tests for a small number of workflows that prove the system is wired together correctly.

## Troubleshooting

### `TEST_MONGODB_URI` is required

Set `TEST_MONGODB_URI` in the root `.env` file or export it in the shell. Setting only `MONGODB_URI` is not enough; test mode intentionally rejects that fallback.

### Chromium is missing

Run `pnpm exec playwright install chromium`.

### E2E server health check times out

Check that port `3001` is available and MongoDB is running. The API must answer `http://127.0.0.1:3001/api/health` before Playwright begins.

### Playwright shows no tests

Run:

```bash
TEST_MONGODB_URI=mongodb://127.0.0.1:27017 pnpm exec playwright test --list
```

The expected result currently lists the authentication and 404 workflows from `tests/e2e/`.

### A test database remains after a failed run

If a process is terminated before teardown runs, inspect MongoDB for databases beginning with `mern_test_` or `mern_e2e_` and remove only the test database belonging to the failed run.
