---
title: Development
description: The tools and conventions that keep the workspace consistent while you build.
---

# Development

Formatting and linting are configured once at the repository root and apply to every
package in the workspace.

<div class="grid cards" markdown>

- [__Middleware__](/development/middleware)

    Protect API routes with the shared authentication and admin guards.
- [__Formatting__](/development/formatting)

    How Biome formats source files and how to customize its formatter.
- [__Linting__](/development/linting)

    How Biome checks code and how to tune its lint rules.
</div>

!!! tip "One configuration file"

    Start with the root `biome.json`. This workspace does not use separate ESLint or
    Prettier configuration files.
