---
title: Formatting
description: How the workspace formats code with Biome and how to customize the formatter.
---

# Formatting

The repository uses **Biome 2.4.5** as its formatter. The configuration lives in
[`biome.json`](https://github.com/abdulkareemakn/mern-app-starter/blob/main/biome.json)
at the workspace root, so the same defaults apply to the functional monorepo.

## Run the formatter

<div class="grid cards" markdown>

- __Check only__

    Reports formatting and lint problems without changing files.

    ```sh
    pnpm check
    ```
- __Format and fix__

    Writes formatting changes and applies safe lint fixes.

    ```sh
    pnpm format
    ```
</div>

`pnpm format` runs `biome check --write .` from the repository root. Run it after
editing, then use `pnpm check` to confirm that the working tree is clean.

## What is configured

The formatter section is intentionally small:

```json
{
  "formatter": {
    "enabled": true,
    "indentStyle": "space"
  }
}
```

That means formatting is enabled and indentation uses spaces. Any formatter option
not listed in `biome.json` uses Biome's default for the installed version.

The root `files.includes` list also controls what Biome sees. It includes the
workspace, while excluding generated or dependency-heavy paths such as
`node_modules`, `dist`, `.tanstack`, `.blume`, generated `routeTree.gen.ts`, and
`pnpm-lock.yaml`.

## Customize it

Change the formatter options in the root `biome.json`, for example:

```json
{
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "lineWidth": 100,
    "quoteStyle": "double"
  }
}
```

Keep formatter settings at the root unless one package genuinely needs a different
policy. After changing them, run `pnpm format` and review the diff—formatting changes
can touch many files.

!!! note "Editor integration"

    There is no committed editor-specific formatter configuration in this repository.
    Configure your editor to use the workspace's Biome installation, or run the root
    commands when you want a guaranteed repository-wide result.
