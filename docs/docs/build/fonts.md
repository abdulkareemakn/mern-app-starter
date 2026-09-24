---
title: Fonts
description: Choose a small type system and keep font files close to the app.
---

# Fonts

Choose three typefaces before building screens:

- **Serif** for editorial or expressive moments
- **Sans serif** for the main interface and body copy
- **Monospace** for code, numbers, and technical details

You may only use the sans serif and monospace roles in the first version, but
choosing all three makes the system intentional and gives the agent clear
boundaries.

## Self-Hosted Fonts

The starter uses self-hosted fonts through [Fontsource](https://fontsource.org/).
This is faster and more predictable than loading Google Fonts at runtime: the
font is bundled with the app, served from the app's own origin, and does not
require a request to a third-party font CDN.

For example:

```sh
pnpm --filter @mern/client add @fontsource-variable/inter
```

Import the family once in `apps/client/src/main.tsx`:

```ts
import "@fontsource-variable/inter";
```

Then assign it to a semantic token in `apps/client/src/styles.css`:

```css
@theme inline {
  --font-sans: "Inter Variable", Inter, system-ui, sans-serif;
  --font-heading: var(--font-sans);
  --font-mono: ui-monospace, monospace;
}
```

Use `@fontsource/<family>` for static families and import only the weights and
styles the UI needs. Do not import a font from Google Fonts at runtime.

## Licensed fonts

For a font that you are licensed to distribute, put `.woff2` files in
`apps/client/public/fonts` and define `@font-face` with `font-display: swap`.
Never commit a font without permission to redistribute it.

## Let the agent do the rest

The design system only asks you for the durable choices: the three typeface
roles, the general personality, and any fonts you must use. Once those are
decided, the AI agent can choose the scale, weights, line height, spacing,
fallbacks, and where each role is applied. Review the result in `DESIGN.md`
instead of answering a giant typography questionnaire.

Related: [Design and UI](/build/design-system), [Typography skill](/reference/skills).
