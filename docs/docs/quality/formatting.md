---
title: Formatting
description: Format the entire workspace consistently with the root Biome configuration.
---

# Formatting with Biome

This starter kit uses [Biome](https://biomejs.dev/) for formatting. One root `biome.json` applies to the client, server, shared packages, tests, and configuration files.

## Format the workspace

Run this from the repository root:

```sh
pnpm format
```

The script runs:

```sh
biome check --write .
```

It formats supported files, organizes imports, and applies safe lint fixes. Review the resulting diff because one command can update several packages.

## Check without writing

```sh
pnpm check
```

This verifies formatting and lint rules without changing files. It is the command to use before committing and in continuous integration.

## Configuration

The formatter configuration is intentionally small:

```json title="biome.json"
{
  "formatter": {
    "enabled": true,
    "indentStyle": "space"
  }
}
```

Unspecified options use the defaults from the installed Biome version. Keep shared formatting policy in the root file so packages do not drift.

## Included and generated files

The root `files.includes` setting scans the workspace and excludes dependencies and generated output:

```json
{
  "files": {
    "includes": [
      "**",
      "!!**/node_modules",
      "!!**/dist",
      "!!**/.tanstack",
      "!!**/routeTree.gen.ts",
      "!!**/pnpm-lock.yaml"
    ]
  }
}
```

Do not hand-format `routeTree.gen.ts` or the lockfile. Their generators own their contents.

## Editor setup

Install the Biome editor extension and select Biome as the formatter for supported files. The root configuration remains the source of truth, regardless of editor settings.

Use format-on-save only if you are comfortable reviewing changes across imports and lint fixes. The repository commands are still the final check.

## Change formatting rules

Add an option only when the project needs a stable rule that differs from Biome's default:

```json
{
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "lineWidth": 100
  }
}
```

After changing a global rule, run `pnpm format`, review the full diff, and commit the configuration and mechanical changes together.

## References

- [Biome formatter](https://biomejs.dev/formatter/)
- [Biome configuration](https://biomejs.dev/reference/configuration/)
