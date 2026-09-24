---
title: Project Structure
description: A tour of the pnpm workspace, from the apps and packages to the root configuration files.
---

# Project structure

This starter kit is organized as a monorepo, with separate pnpm workspaces for the client, server, and shared packages. This simplifies development by reducing context switching, eliminating redundant configuration, and keeping shared types in sync across the codebase. It also enables the Express API and React frontend to be served from a single deployment.

## Workspace layout

```text
.
├── apps/
│   ├── client/                 # React + Vite client application
│   │   ├── src/
│   │   │   ├── components/ui/  # Reusable UI components
│   │   │   ├── lib/            # Client-side integrations
│   │   │   ├── pages/          # Standalone client pages, such as 404
│   │   │   ├── routes/         # TanStack Router file routes
│   │   │   ├── main.tsx        # Browser entry point
│   │   │   ├── routeTree.gen.ts # Generated TanStack Router route tree
│   │   │   ├── router.tsx      # Router setup
│   │   │   └── styles.css      # Global styles and theme
│   │   ├── components.json     # UI generator configuration
│   │   └── vite.config.ts
│   ├── server/                 # Express + MongoDB API
│   │   ├── src/
│   │   │   ├── app.ts          # API routes
│   │   │   ├── auth.ts         # Better Auth configuration
│   │   │   ├── config.ts       # Environment validation
│   │   │   ├── database.ts     # MongoDB connection
│   │   │   ├── index.ts        # Server startup
│   │   │   ├── lib/            # Server integrations, such as email
│   │   │   ├── middleware/     # Authentication and authorization guards
│   │   │   └── schemas/        # Request-validation schemas
│   │   └── tsconfig.json
├── packages/
│   ├── emails/                 # React Email templates
│   ├── mail/                   # Local MailDev service
│   └── shared/                 # Browser-safe shared TypeScript contracts
│       └── src/index.ts
├── .vscode/                    # Workspace editor settings
├── .env.example                # Local environment template
├── DESIGN.md                    # Product design direction
├── biome.json                  # Formatting and linting configuration
├── compose.db.yaml             # Development MongoDB service
├── compose.yaml                # Full app + MongoDB stack
├── deno.json                   # Deno Deploy configuration
├── Dockerfile                  # Production image build
├── package.json                # Root scripts and workspace metadata
├── playwright.config.ts         # End-to-end test configuration
├── pnpm-workspace.yaml         # Workspace package globs
├── tests/                      # Unit, integration, and end-to-end tests
├── vitest.config.ts             # Unit and integration test configuration
└── pnpm-lock.yaml              # Locked dependency versions
```

The `client` and `server` packages are the runnable application. `shared` contains
types only, `emails` contains email templates, and `mail` runs the local development inbox. Tests live at the repository root.

## Source path aliases

The client and server map both `@/*` and `#/*` to their own `src/` directory.
Use `@/` for client UI imports, matching the shadcn configuration, and `#/` for
other client-local or server-local modules:

```ts
import { Button } from "@/components/ui/button";
import { authClient } from "#/lib/auth-client";
```

The mappings are defined in each app's `tsconfig.json`. The server also exposes
`#/*` through conditional package imports so it resolves to `src/` in
development and compiled `dist/` files in production. Use `#/` in server source;
Node does not resolve the `@/` form at runtime.

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
- Add request validation schemas under `apps/server/src/schemas/`.
- Add reusable Express guards under `apps/server/src/middleware/`.
- Add application models under `apps/server/src/models/`.
- Add routed browser pages under `apps/client/src/routes/`, and reusable UI components to `apps/client/src/components/ui/`.
- Add browser/server response contracts to `packages/shared/src/index.ts`. Keep database and server-only code out of this package.
- Add React Email templates to `packages/emails/`.
- Add tests under `tests/unit/`, `tests/integration/`, or `tests/e2e/` for the
  matching test level.

## Next step

Continue to [Design and UI](/build/design-system) before adding screens.

## References

- [pnpm workspaces](https://pnpm.io/workspaces)
- [TanStack Router file-based routing](https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing)
- [Build your app](/build/)
