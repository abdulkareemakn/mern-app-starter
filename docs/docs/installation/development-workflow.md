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

### File storage

File uploads are optional. Cloudflare R2 and Backblaze B2 are the recommended
S3-compatible providers. Create a private bucket and a bucket-scoped credential
that can read, write, and delete objects. Then uncomment and fill in all five
connection settings from `.env.example` in the local `.env`, or inject them through
the production host's secret settings:

| Variable | Value |
| --- | --- |
| `STORAGE_ENDPOINT` | The provider's S3 HTTP(S) origin, without a bucket path, query, or embedded credentials |
| `STORAGE_REGION` | `auto` for R2; the bucket's region for B2 |
| `STORAGE_BUCKET` | The private bucket name |
| `STORAGE_ACCESS_KEY_ID` | The storage access key ID; B2 uses an application key ID |
| `STORAGE_SECRET_ACCESS_KEY` | The corresponding secret access key; B2 uses the application key |

For R2, the usual endpoint is `https://<account-id>.r2.cloudflarestorage.com`.
For B2, use `https://s3.<region>.backblazeb2.com`. Replace the placeholders with the
values shown by the provider. Use HTTPS for hosted buckets.

When all five settings are absent, the API starts but authenticated upload requests
return `503`. If any is supplied, all five must be nonempty or startup fails.
Restart the API after changing configuration. Never prefix storage credentials with
`VITE_` or send them to clients.

The following policy settings already have defaults:

| Variable | Default | Accepted values |
| --- | --- | --- |
| `STORAGE_MAX_UPLOAD_BYTES` | `26214400` (25 MiB) | Whole bytes from 1 to 5000000000 |
| `STORAGE_ALLOWED_MIME_TYPES` | `image/jpeg,image/png,image/webp,application/pdf` | Comma-separated MIME types with known extensions; no wildcards or empty entries |
| `STORAGE_PENDING_MAX_AGE_HOURS` | `24` | Whole hours from 1 to 8760 |

The allowlist is trimmed and lowercased during configuration parsing. Requests must
use an exact resulting MIME type. The pending age controls eligibility for
[cleanup](/build/cron-jobs/#pending-upload-cleanup); it does not start a scheduler.

For browser uploads, configure the bucket's CORS rules to allow the application
origin, `PUT` and `GET`, and the `Content-Type` request header. CORS tells the browser
which cross-origin requests it can make; it does not make the bucket public. Use the
provider's [R2 CORS guide](https://developers.cloudflare.com/r2/buckets/cors/) or
[B2 CORS guide](https://www.backblaze.com/docs/cloud-storage-cross-origin-resource-sharing-rules)
for the provider-specific format.

Follow [File uploads](/build/file-uploads) to verify the configuration with a direct
PUT, confirmation, and private download. Receiving an upload URL alone does not
verify bucket access.

### Upload test database

The upload integration tests read the test database address from the process
environment, not from `.env`. Start a dedicated MongoDB server first, then run one
of these commands from the repository root in the terminal that will run tests.
These examples use the local MongoDB server; substitute a dedicated test server
address when needed.

=== "Windows PowerShell"

    ```powershell
    $env:TEST_MONGODB_URI = "mongodb://127.0.0.1:27017"
    ```

=== "macOS / Linux"

    ```sh
    export TEST_MONGODB_URI=mongodb://127.0.0.1:27017
    ```

The tests supply dummy storage settings and mock S3 network calls. Real bucket
credentials are not needed. See [File uploads: Verify and troubleshoot](/build/file-uploads/#verify-and-troubleshoot)
for the test commands and [Testing](/quality/testing/#mongodb) for MongoDB setup.

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
- [Cloudflare R2 S3 client configuration](https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/)
- [Cloudflare R2 CORS configuration](https://developers.cloudflare.com/r2/buckets/cors/)
- [Backblaze B2 S3-compatible API](https://www.backblaze.com/docs/cloud-storage-s3-compatible-api)
- [Backblaze B2 CORS rules](https://www.backblaze.com/docs/cloud-storage-cross-origin-resource-sharing-rules)

Related starter documentation:

- [File uploads](/build/file-uploads)
- [Commands](/reference/commands)
- [Testing](/quality/testing)
