---
title: Server configuration
description: How apps/server/src/config.ts validates the environment and fails fast with a clear message.
---

# Server configuration

TODO: Introduce the page — configuration is validated once at startup and the process
exits rather than running half-configured.

## What is validated

TODO: Walk through `readConfig` in `apps/server/src/config.ts`:

- `NODE_ENV` is one of `development`, `test`, or `production`
- `PORT` is an integer between 1 and 65535
- `MONGODB_URI` starts with `mongodb://` or `mongodb+srv://`
- `BETTER_AUTH_SECRET` is at least 32 characters
- `APP_URL` and `BETTER_AUTH_URL` are HTTP(S) origins with no path, credentials, query,
  or fragment, and must match
- `TRUST_PROXY` is parsed into a list of trimmed entries

## Why it fails fast

TODO: Explain the startup sequence in `index.ts` and the intended benefit: a
misconfigured deployment stops immediately instead of serving broken requests.

## Testing configuration

TODO: Explain that `pnpm test` runs `apps/server/test/config.test.ts` against
`readConfig` without needing MongoDB.

## Adding a setting

TODO: Specify the steps for a new variable — add it to `.env.example`, read and validate
it in `readConfig`, and document it in `/docs/configuration/environment-variables`.
