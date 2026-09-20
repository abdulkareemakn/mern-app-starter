---
title: Conventions
description: The code style, naming, and verification rules every change is expected to follow.
---

# Conventions

TODO: Introduce the page. Short, enforceable rules beat long prose.

## Formatting and linting

TODO: Explain that Biome owns formatting and linting from the workspace root, that
`pnpm format` writes fixes, and that TypeScript uses two-space indentation.

## TypeScript

TODO: Document the conventions a reader must follow, for example:

- relative imports inside a package, workspace imports across packages
- `import type` for anything from `@mern/shared`
- no `any` where a shared contract type exists

## Naming

TODO: Cover the naming conventions: `@mern/*` package names, file names for routes and
models, and kebab-case for documentation folders and slugs.

## Server rules

TODO: Restate the non-negotiables: keep the auth handler before `express.json()`,
validate request bodies, never log secrets or raw dependency errors, and check the
session on every private endpoint.

## Commits and checks

TODO: Describe the checks to run before committing: `pnpm typecheck`, `pnpm check`, and
`pnpm test`; plus `pnpm test:integration` when authentication or configuration changed.

## Documentation changes

TODO: Point contributors at `docs/README.md` for how to add and order documentation pages.
