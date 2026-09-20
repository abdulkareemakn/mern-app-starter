---
title: Project structure
description: A tour of the pnpm workspace, from the apps and packages to the root configuration files.
---

# Project structure

This is a small pnpm workspace containing the client, server, and shared packages.
The root `docs/` site is deliberately outside that workspace.

## Workspace layout

```text
.
├── apps/
│   ├── client/                 # React + Vite browser app
│   │   ├── src/
│   │   │   ├── components/ui/  # Reusable UI components
│   │   │   ├── lib/            # Client-side integrations
│   │   │   ├── routes/         # TanStack Router file routes
│   │   │   ├── main.tsx        # Browser entry point
│   │   │   ├── router.tsx      # Router setup
│   │   │   └── styles.css      # Global styles and theme
│   │   ├── components.json     # UI generator configuration
│   │   └── vite.config.ts
│   ├── server/                 # Express + MongoDB API
│   │   ├── src/
│   │   │   ├── app.ts          # Middleware and API routes
│   │   │   ├── auth.ts         # Better Auth configuration
│   │   │   ├── config.ts       # Environment validation
│   │   │   ├── index.ts        # Database connection and startup
│   │   │   ├── lib/            # Server integrations, such as email
│   │   │   └── middleware/     # Authentication and authorization guards
│   │   └── test/               # Node test-runner tests
├── packages/
│   ├── emails/                 # React Email templates
│   └── shared/                 # Browser-safe shared TypeScript contracts
│       └── src/index.ts
├── docs/                       # Zensical Markdown content
├── .github/workflows/          # GitHub Actions workflows
├── .vscode/                    # Workspace editor settings
├── .env.example                # Local environment template
├── biome.json                  # Formatting and linting configuration
├── compose.db.yaml             # Development MongoDB service
├── compose.yaml                # Full app + MongoDB stack
├── Dockerfile                  # Production image build
├── package.json                # Root scripts and workspace metadata
├── pnpm-workspace.yaml         # Workspace package globs
└── pnpm-lock.yaml              # Locked dependency versions
```

The `client` and `server` packages are the runnable application. `shared` contains
types only, `emails` contains email templates, and the standalone `docs/` directory
contains this site.
Generated output such as `dist/`, `node_modules/`, and local tool caches is not
part of the source tree shown above.

## Root configuration files

Most root-level configuration is for development and deployment:

- `.env.example` lists the environment variables used by the server and Compose.
- `pnpm-workspace.yaml` defines `apps/*` and `packages/*` as workspace packages.
- `package.json` contains the commands for development, builds, checks, tests,
  and Docker Compose.
- `biome.json` configures formatting and linting.
- `compose.db.yaml` starts MongoDB for local development; `compose.yaml` starts
  the production-style app and MongoDB stack.
- `Dockerfile` builds the client and server into the production image.

## Where to add code

Put new code in the package that owns it:

- Add API endpoints in `apps/server/src/app.ts` and server integrations under
  `apps/server/src/lib/`.
- Add authentication changes in `apps/server/src/auth.ts`; keep environment
  validation in `apps/server/src/config.ts`.
- Add reusable Express guards under `apps/server/src/middleware/`.
- Add application models under `apps/server/src/models/` when the first model is
  needed. That directory does not exist yet because the starter has no application
  models.
- Add browser pages as files under `apps/client/src/routes/`; add reusable UI to
  `apps/client/src/components/ui/`.
- Add browser/server response contracts to `packages/shared/src/index.ts`. Keep
  database and server-only code out of this package.
- Add React Email templates to `packages/emails/`.

## Next steps

Next, follow [API routes](/build/api-routes).
