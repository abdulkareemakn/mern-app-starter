---
version: alpha
name: MERN Course Starter
colors:
  background: "oklch(1 0 0)"
  foreground: "oklch(0.145 0 0)"
  card: "oklch(1 0 0)"
  card-foreground: "oklch(0.145 0 0)"
  popover: "oklch(1 0 0)"
  popover-foreground: "oklch(0.145 0 0)"
  primary: "oklch(0.205 0 0)"
  primary-foreground: "oklch(0.985 0 0)"
  secondary: "oklch(0.97 0 0)"
  secondary-foreground: "oklch(0.205 0 0)"
  muted: "oklch(0.97 0 0)"
  muted-foreground: "oklch(0.5 0 0)"
  accent: "oklch(0.97 0 0)"
  accent-foreground: "oklch(0.205 0 0)"
  destructive: "oklch(0.577 0.245 27.325)"
  border: "oklch(0.922 0 0)"
  input: "oklch(0.922 0 0)"
  ring: "oklch(0.708 0 0)"
  dark-background: "oklch(0.145 0 0)"
  dark-foreground: "oklch(0.985 0 0)"
  dark-card: "oklch(0.205 0 0)"
  dark-card-foreground: "oklch(0.985 0 0)"
  dark-primary: "oklch(0.922 0 0)"
  dark-primary-foreground: "oklch(0.205 0 0)"
  dark-secondary: "oklch(0.269 0 0)"
  dark-secondary-foreground: "oklch(0.985 0 0)"
  dark-muted: "oklch(0.269 0 0)"
  dark-muted-foreground: "oklch(0.708 0 0)"
  dark-accent: "oklch(0.269 0 0)"
  dark-accent-foreground: "oklch(0.985 0 0)"
  dark-destructive: "oklch(0.704 0.191 22.216)"
  dark-border: "oklch(1 0 0 / 10%)"
typography:
  body:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  heading:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: 1.875rem
    fontWeight: 600
    lineHeight: 1.2
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
spacing:
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
rounded:
  sm: 0.375rem
  md: 0.5rem
  lg: 0.625rem
components:
  body:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.lg}"
  primary-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
  secondary-button:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.md}"
  muted-copy:
    backgroundColor: "{colors.background}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body}"
  destructive-button:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
  popover:
    backgroundColor: "{colors.popover}"
    textColor: "{colors.popover-foreground}"
  muted-surface:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.muted-foreground}"
  accent-surface:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
  field:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
  input-surface:
    backgroundColor: "{colors.input}"
    textColor: "{colors.foreground}"
  divider:
    backgroundColor: "{colors.border}"
    textColor: "{colors.foreground}"
  dark-surfaces:
    backgroundColor: "{colors.dark-background}"
    textColor: "{colors.dark-foreground}"
  dark-card:
    backgroundColor: "{colors.dark-card}"
    textColor: "{colors.dark-card-foreground}"
  dark-primary-button:
    backgroundColor: "{colors.dark-primary}"
    textColor: "{colors.dark-primary-foreground}"
  dark-secondary-button:
    backgroundColor: "{colors.dark-secondary}"
    textColor: "{colors.dark-secondary-foreground}"
  dark-muted-surface:
    backgroundColor: "{colors.dark-muted}"
    textColor: "{colors.dark-muted-foreground}"
  dark-accent-surface:
    backgroundColor: "{colors.dark-accent}"
    textColor: "{colors.dark-accent-foreground}"
  dark-danger:
    backgroundColor: "{colors.dark-destructive}"
    textColor: "{colors.dark-primary-foreground}"
  dark-field:
    backgroundColor: "{colors.dark-card}"
    textColor: "{colors.dark-foreground}"
---

## Overview

This is a restrained, accessible baseline for a student project. The neutral semantic palette and Inter Variable are replaceable after the product direction is chosen; this file records the current implementation so agents do not guess.

## Colors

Light tokens map directly to `:root` in `apps/client/src/styles.css`; `dark-*` tokens map to the `.dark` block. The default system uses neutral surfaces, a dark primary action, and a recognizable destructive red. Add accent, status, or chart ramps only when a feature needs them.

## Typography

Inter Variable is bundled with Fontsource and loaded from the application origin. Body text is readable at the browser default size; headings use a modest weight and unitless leading. Preserve browser text scaling and add a separate display role only when the product needs one.

## Layout

Use the existing Tailwind spacing scale, content-driven breakpoints, and readable measure. Keep primary actions and form targets usable at narrow widths and 200% zoom.

## Elevation & Depth

Prefer borders and surface contrast over decorative shadows. Add a small, documented elevation only for overlays or clearly separated navigation.

## Shapes

The radius family is intentionally moderate and concentric: nested controls should not appear rounder than their container.

## Components

Use Base UI shadcn primitives from `apps/client/src/components/ui`, semantic color utilities, visible keyboard focus, and explicit labels. Feature compositions belong in `apps/client/src/components`.

## Do's and Don'ts

- Do use semantic tokens and the configured icon family.
- Do keep destructive states recognizable with more than color alone.
- Don't add one-off hex values or a second general-purpose icon library.
- Don't change copied shadcn defaults without reconciling this document.

## Iconography

Lucide is the configured interface icon family. Brand identities may use on-demand Simple Icons exports from `react-icons/si`; brand icons are not a replacement for interface icons.

## Implementation

The implementation uses Base UI, shadcn CSS variables, Tailwind v4, and `components.json`. `DESIGN.md` is canonical; shadcn configuration and CSS are implementations that must be reconciled after changes. Validate with `pnpm design:lint`.

The lint report may identify `ring` and dark border as unreferenced tokens because they are non-text focus/separator values rather than contrast-testable component foregrounds; they remain documented implementation roles in CSS.
