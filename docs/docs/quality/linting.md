---
title: Linting
description: Catch correctness problems and organize imports with Biome's recommended rules.
---

# Linting with Biome

This starter kit uses Biome's linter instead of ESLint. The root configuration applies one rule set throughout the pnpm workspace.

## Run the checks

```sh
pnpm check
```

Biome checks formatting, lint rules, and enabled source actions together. Read the diagnostic category to distinguish a formatting failure from a correctness warning.

Apply formatting and safe fixes with:

```sh
pnpm format
```

Unsafe fixes are not applied automatically. Review the diagnostic and change the code yourself when Biome marks a fix as unsafe.

## Configuration

```json title="biome.json"
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "assist": {
    "actions": {
      "source": {
        "organizeImports": "on"
      }
    }
  }
}
```

The recommended rules catch common correctness, suspicious-code, and maintainability problems. Import organization is enabled as a source action, so `pnpm format` may remove or reorder imports.

Tailwind directives are also enabled for CSS parsing:

```json
{
  "css": {
    "parser": {
      "tailwindDirectives": true
    }
  }
}
```

## Fix a diagnostic

Use this order:

1. Read the rule name and explanation.
2. Fix the code if the rule identified a real issue.
3. Run `pnpm format` for safe mechanical fixes.
4. Run `pnpm check` again.

Do not disable a rule only to make the command green. If a recommended rule genuinely conflicts with the repository, add the narrowest root override and document why.

```json
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedVariables": "off"
      }
    }
  }
}
```

Avoid package-local Biome files unless a package has a lasting and unavoidable difference.

## Check one path

While iterating, Biome can check a smaller target:

```sh
pnpm exec biome check apps/server/src
```

Run the root `pnpm check` before finishing so unrelated workspace configuration is not missed.

## References

- [Biome linter](https://biomejs.dev/linter/)
- [Biome recommended rules](https://biomejs.dev/linter/rules/)
- [Biome assists](https://biomejs.dev/assist/)
