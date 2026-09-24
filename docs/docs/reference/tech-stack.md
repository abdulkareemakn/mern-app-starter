---
title: Tech stack
description: The starter's direct dependencies and the files that define their versions.
---

# Tech stack

The starter is a pnpm workspace. This page names the tools you work with directly; the manifests and lockfile are the source of truth for versions, including transitive packages.

## Runtime and workspace

| Tool | Role | Canonical file |
| --- | --- | --- |
| Node.js 24 or newer | Application runtime | Root `package.json` `engines` |
| pnpm 11.3.0 | Workspace and package manager | Root `package.json` `packageManager` |
| TypeScript | Type checking and server build | Root `package.json` |

## Client

| Direct dependency | Role |
| --- | --- |
| React and React DOM | UI rendering |
| Vite | Development server and client build |
| TanStack Router | File routes and typed navigation |
| Axios | Browser requests to the Express API |
| Tailwind CSS and its Vite plugin | Styling |
| shadcn/ui with Base UI | Editable components and accessible primitives |
| Lucide React | Interface icons |
| Fontsource Inter Variable | Bundled font |

Check `apps/client/package.json` and `apps/client/components.json` for the current package set and UI configuration.

## Server and data

| Direct dependency | Role |
| --- | --- |
| Express 5 | API and production static server |
| Better Auth | Accounts and sessions |
| Mongoose | Application data models and MongoDB connection |
| Zod 4 | Runtime input and configuration validation |
| Nodemailer | Development SMTP delivery |
| Resend | Production email delivery |

Check `apps/server/package.json` for versions. `compose.db.yaml` and `compose.yaml` select the MongoDB image.

## Email, tests, and deployment

`packages/emails/package.json` defines React Email; `packages/mail/package.json` defines MailDev. The root and server manifests define Biome, Vitest, Supertest, and Playwright. `deno.json` defines the Deno Deploy build and runtime; `Dockerfile` and `compose.yaml` define the container path.

For the exact installed dependency graph, inspect `pnpm-lock.yaml` in the application repository. Update this page when a direct technology or its role changes, not for every lockfile refresh.

## References

- [Application repository](https://github.com/abdulkareemakn/mern-app-starter)
- [Commands](/reference/commands)
