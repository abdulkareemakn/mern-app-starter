---
title: Environment Variables
description: Configure local development, authentication, MongoDB, tests, proxies, and Docker without exposing secrets.
---

# Environment variables

Copy `.env.example` to `.env` at the repository root:

```sh
cp .env.example .env
```

Keep `.env` private. Commit `.env.example` with safe placeholders so every required setting remains discoverable.

The configuration path has one direction:

```text
.env or hosting platform
        ↓
Node loads process.env
        ↓
readConfig(process.env)
        ↓
Zod validates and transforms
        ↓
typed Config used by the server
```

Node handles loading. Zod defines the server's contract. Application modules consume `Config` instead of reading arbitrary values from `process.env`.

## How values are loaded

- Development and production server scripts load the root `.env`, when present, with Node's `--env-file-if-exists` option.
- Vite reads the root directory because `apps/client/vite.config.ts` sets `envDir`.
- Playwright loads the root `.env` before starting its test servers.
- Docker Compose reads values supplied by the shell or a root `.env` file.

Production does not require an environment file. A hosting platform or container can inject the same variables directly.

The server passes `process.env` to `readConfig()` once in `apps/server/src/index.ts`. The Zod schema in `apps/server/src/config.ts` validates the raw strings before MongoDB connects or Express listens. `readConfig()` does not load files, so unit tests can pass a plain object without depending on a developer's `.env`.

## Validated configuration

The rest of the server receives this parsed shape:

| Config property | Environment source | Parsed value |
| --- | --- | --- |
| `nodeEnv` | `NODE_ENV` | `development`, `test`, or `production` |
| `port` | `PORT` | Number from 1 through 65535 |
| `mongodbUri` | `MONGODB_URI` or `TEST_MONGODB_URI` | MongoDB connection URL |
| `appUrl` | `APP_URL` | Normalized HTTP(S) origin |
| `authUrl` | `BETTER_AUTH_URL` | Normalized HTTP(S) origin |
| `secret` | `BETTER_AUTH_SECRET` | String with at least 32 characters |
| `resendApiKey` | `RESEND_API_KEY` | Required string in production |
| `trustProxy` | `TRUST_PROXY` | Array parsed from a comma-separated string |

For example, `PORT=4321` becomes the number `4321`; callers do not parse it again.

## Server settings

| Variable | Default | Purpose |
| --- | --- | --- |
| `NODE_ENV` | `development` | Must be `development`, `test`, or `production`. |
| `PORT` | `3001` | Internal port used by Express. |
| `MONGODB_URI` | None | MongoDB URL for development or production application data. |
| `TRUST_PROXY` | Empty | Comma-separated Express trusted-proxy values such as IP addresses or CIDRs. |

Do not set `TRUST_PROXY` to a broad value unless that network is actually controlled by your proxy. Express uses it when determining the client address.

## Public application URLs

```bash
APP_URL=https://mern.localhost
BETTER_AUTH_URL=https://mern.localhost
```

These must be HTTP(S) origins with no path, query, credentials, or fragment. They must match because the starter serves authentication through the same public browser origin as the client.

The API also has a direct Portless route at `https://api.mern.localhost`, but browser code should call `/api`. Vite proxies that path to Express, preserving same-origin cookies.

## Authentication secret

Generate a secret of at least 32 characters:

```sh
openssl rand -base64 32
```

Store the result in `BETTER_AUTH_SECRET`. Never commit it or expose it to browser code.

## Development proxy ports

| Variable | Default | Purpose |
| --- | --- | --- |
| `API_PORT` | `3001` | Internal Express target used by Vite's `/api` proxy. |

Portless maps stable hostnames to the fixed internal ports in `portless.json`:

| Service | Public development URL | Internal target |
| --- | --- | --- |
| Client | `https://mern.localhost` | `localhost:3000` |
| API | `https://api.mern.localhost` | `localhost:3001` |
| Email preview | `https://emails.localhost` | `localhost:3002` |
| MailDev inbox | `https://mail.localhost` | `localhost:3003` |

The public URLs do not include the internal port. Portless terminates local HTTPS and forwards to each process.

Development email uses SMTP on `localhost:3025`. Production requires `RESEND_API_KEY`; startup fails when it is absent. Keep it only in the server environment.

## Test database

```bash
TEST_MONGODB_URI=mongodb://127.0.0.1:27017
```

Test mode requires this separate setting and never falls back to `MONGODB_URI`. Integration and E2E runs add random database names and remove those databases afterward.

Do not point `TEST_MONGODB_URI` at production, Atlas, a shared server, or the normal development database. The configured server must permit the test user to create and drop temporary databases.

Unit configuration tests call `readConfig()` with explicit objects and do not need `.env`. Integration and E2E entrypoints load `.env` only to obtain the explicitly configured test server.

## Docker port

`APP_PORT` controls the host port published by the full Docker Compose stack. Its default is `3000`. It does not change `APP_URL` or `BETTER_AUTH_URL`.

## Browser exposure

Only variables prefixed with `VITE_` are exposed through `import.meta.env`. Never use that prefix for secrets, MongoDB URLs, private service credentials, or `BETTER_AUTH_SECRET`.

This starter does not need a browser-visible API URL because the client calls the same-origin `/api` path.

## Configuration errors

Invalid configuration stops startup and identifies the affected variable without printing its value:

```text
Error: Invalid environment configuration:
- MONGODB_URI: MONGODB_URI is required when NODE_ENV=development
```

Fix every listed variable and restart the server. Do not catch these errors and continue with partial configuration.

## Add a setting

For a new server setting:

1. Add a safe placeholder to `.env.example`.
2. Validate it in `apps/server/src/config.ts`.
3. Read the validated value from `Config`, not directly throughout the application.
4. Add production and test values where required.
5. Document it here.

## Reference

- [Node environment files](https://nodejs.org/api/environment_variables.html#env-files)
- [Node `--env-file` command-line option](https://nodejs.org/api/cli.html#--env-filefile)
- [Zod basics](https://zod.dev/basics)
- [Vite environment variables](https://vite.dev/guide/env-and-mode)
- [Portless](https://github.com/vercel-labs/portless)
- [Testing](/quality/testing)
- [Production build](/deployment/production-build)
- [Authentication](/build/authentication)
- [Database](/build/database)
