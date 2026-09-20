---
title: Testing
description: Test schemas, API behavior, authentication, and complete browser workflows with Vitest, Supertest, and Playwright.
---

# Testing

The starter has three test layers. Use the cheapest layer that proves the behavior, then run broader checks when a change crosses application boundaries.

## Test structure

```text
apps/server/test/
  unit/                  # Vitest tests for schemas and configuration
  integration/           # Vitest and Supertest API tests
  e2e-server.ts          # Isolated server used by Playwright
  e2e-teardown.ts        # Removes the E2E database

e2e/
  auth.spec.ts           # Playwright browser workflow
```

## Unit tests

Run fast tests that do not need MongoDB or an HTTP listener:

```sh
pnpm test:unit
```

Use unit tests for pure behavior such as environment parsing and Zod schemas.

```ts
test("trims a valid user name", () => {
  expect(createUserSchema.parse(validUser).name).toBe("Ada");
});
```

Keep these tests focused on observable behavior rather than implementation details.

## API integration tests

```sh
pnpm test:integration
```

Integration tests use Supertest to send requests through Express middleware and routes. They cover request validation, response shapes, status codes, authentication, and persistence.

```ts
test("rejects an invalid request body", async () => {
  const response = await request(app)
    .post("/api/example/users")
    .send({ name: "", email: "invalid", age: 12 });

  expect(response.status).toBe(400);
  expect(response.body.error).toBe("Invalid request body");
});
```

Representative middleware tests may create a small Express app inside the test file. Do not add production endpoints solely to exercise middleware.

## Test MongoDB safely

Add a dedicated server URL to `.env`:

```bash
TEST_MONGODB_URI=mongodb://127.0.0.1:27017
```

Test mode requires this value and never falls back to `MONGODB_URI`. Persistence tests create random `mern_test_*` databases and delete them afterward. The MongoDB user must have permission to create and drop those databases.

Never point `TEST_MONGODB_URI` at a production server or at the application's named database.

## End-to-end tests

Playwright starts the real client and server, drives Chromium, and verifies the complete sign-up, protected API, and sign-out workflow:

```sh
pnpm test:e2e
```

Install the supported browser once:

```sh
pnpm exec playwright install chromium
```

For interactive debugging:

```sh
pnpm test:e2e:ui
```

E2E runs use a random `mern_e2e_*` database and remove it during teardown. Use Playwright for cross-application workflows, not for logic already covered by a schema or API test.

## Run the normal verification set

```sh
pnpm test
pnpm typecheck
pnpm check
```

`pnpm test` runs unit tests followed by API integration tests. It therefore needs `TEST_MONGODB_URI` when the integration suite includes persistence tests.

For a server-only change, run the relevant unit or integration file while iterating, then the full affected command before finishing. For a request-pipeline or user-workflow change, include the E2E test when the required database and browser are available.

## Write durable tests

- Assert public behavior such as status, JSON, redirects, and persisted records.
- Cover both the successful path and important rejection paths.
- Verify parsed values when validation trims, coerces, defaults, or transforms data.
- Use random identifiers for accounts and records that must be unique.
- Keep production secrets and application databases out of tests.
- Do not weaken an existing assertion to accommodate a regression.

## Reference

- [Vitest](https://vitest.dev/)
- [Supertest](https://github.com/forwardemail/supertest)
- [Playwright](https://playwright.dev/)
- [Validation](/build/validation)
- [API routes](/build/api-routes)
- [Database](/build/database)
