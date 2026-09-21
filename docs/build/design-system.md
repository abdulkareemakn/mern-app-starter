---
title: Design system
description: Establish and maintain a student-friendly design system.
---

# Design system

Start the design system before building a large feature. The repository's `design-md` skill asks for a few meaningful product choices—what you are building, the visual character, color direction, type character, density, rounding, and icon style—then derives the detailed scale, semantic roles, responsive rules, accessibility constraints, and component guidance.

This keeps students out of a giant token questionnaire. In a fresh project, the agent inspects configuration and installed components instead of pretending that an empty app needs a visual audit. In an established app, tell it whether to preserve, evolve, or replace the current direction before it changes anything.

## Source of truth

`DESIGN.md` records canonical design intent. shadcn/ui implements the subset it supports; `apps/client/src/styles.css` and application code implement the remainder. The stylesheet should consume semantic roles (`background`, `foreground`, `primary`, `muted`, `border`, and so on), not feature-specific hex values.

Use one neutral scale and one accent scale by default. The agent maps them to semantic roles, keeps destructive states recognizable as danger, and checks contrast. Do not manually assign every shade.

## Establish or change the system

Ask an agent to use the project-local `design-md` skill, review the generated decision matrix, and write `DESIGN.md`. Then run:

```sh
pnpm design:lint
pnpm ui info
```

When changing an established system, update `DESIGN.md` first, apply the corresponding shadcn change, then reconcile CSS and copied components. A disagreement is resolved in this order: explicit product intent in `DESIGN.md`, shadcn configuration for supported implementation details, and CSS/application code for the rest. Never silently overwrite an established product direction.

## shadcn relationship

Use `pnpm ui apply <preset>` or `pnpm ui migrate ...` only after reviewing the diff. Those commands rewrite implementation files; they do not replace the design specification. See [shadcn/ui](shadcn-ui.md) for supported styles, base colors, icon migrations, and safe update commands.

## Ongoing checks

Lint after every design-system edit. Review contrast in both light and dark themes, zoom to 200%, test keyboard focus, and check narrow screens. Agents should read `DESIGN.md` before creating new UI so new components use the existing vocabulary rather than introducing one-off tokens.
