---
title: Fonts
description: Self-host fonts without depending on a third-party font CDN.
---

# Fonts

The client is prepared for self-hosted fonts. `src/styles.css` exposes `font-sans`, `font-heading`, and `font-mono`; `public/fonts/.gitkeep` reserves a location for licensed local files. Keep the font decision in `DESIGN.md`, then make the smallest matching implementation change.

## Fontsource (recommended)

Fontsource packages download the font into your build and generate local CSS. For a variable family:

```sh
pnpm --filter @mern/client add @fontsource-variable/inter
```

Import it once in `apps/client/src/main.tsx`:

```ts
import "@fontsource-variable/inter";
```

Set the matching family in `src/styles.css`:

```css
@theme inline {
  --font-sans: "Inter Variable", Inter, system-ui, sans-serif;
}
```

Replace `inter` with the Fontsource family chosen for the project. Static families use `@fontsource/<family>`; import only the weights and styles the UI actually uses. Do not import a family from Google Fonts at runtime.

## Local files

For a font you have a licence to distribute, put `.woff2` files in `public/fonts` and declare them with `@font-face`. Use `font-display: swap`, a correct `unicode-range` when available, and a variable `font-weight` range when the file is variable. Never commit an unlicensed font.

## Verification

Build the client and confirm the generated assets contain the font files. In the browser network panel, a font request should resolve to the app's own origin. Check fallback rendering, keyboard focus, 200% zoom, and long headings. `shadcn apply --only font` can help implement a shadcn preset, but `DESIGN.md` remains the source of truth.
