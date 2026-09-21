# Authoring and validating DESIGN.md

Verified against `@google/design.md` 0.4.0, specification `alpha`, on 2026-09-20. Refresh with `pnpm design spec` and `pnpm design spec --rules-only --format json`. Authoritative [Google specification](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md) and [CLI](https://github.com/google-labs-code/design.md). The [Hermes baseline](https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/design-md/SKILL.md) informed authoring/lint/diff guidance; its older rule count and automatic-export recommendation are not this project's contract.

## Format contract

Use YAML frontmatter fenced by `---` followed by Markdown. This workflow requires useful machine-readable tokens even though the upstream format allows prose alone. Include `version: alpha`, `name`, `colors`, relevant `typography`, `spacing`, `rounded`, and `components`.

| Group | Shape |
| --- | --- |
| `colors` | Flat map of token names to CSS colors; quote hex values. Hex or existing OKLCH notation is fine. |
| `typography` | Role objects: `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`, `fontFeature`, `fontVariation`. Use only relevant fields. |
| `spacing` | Flat map to dimensions or numbers; prefer dimensions for actual distances. |
| `rounded` | Flat map to dimensions. |
| `components` | Flat named entries; properties are `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height`, `width`. |

Dimensions support px, rem and em. Keep `clamp()`, percentages, viewport units, compound shadows, motion and breakpoint formulas in prose/CSS rather than pretending they are schema dimensions. Use unitless numeric lineHeight. `fontFeature`/`fontVariation` are singular property names. Use quoted `{colors.primary}`, `{rounded.md}` and `{typography.body}` references, with the group path. Variants are sibling entries (`button-primary-hover`), not nested objects.

Keep the canonical `##` sections in this order: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts. Omit only irrelevant sections, with reasons if useful. Add `## Iconography`, `## Motion`, `## Implementation` afterward where needed; unknown prose headings are supported. Do not duplicate headings. No standardized YAML icon, shadow, animation, theme-mode or shadcn group exists; do not invent one.

## Color mapping and modes

Use shadcn names for semantic color tokens: background/foreground, card/card-foreground, popover/popover-foreground, primary/primary-foreground, secondary/secondary-foreground, muted/muted-foreground, accent/accent-foreground, destructive/destructive-foreground, border, input, ring. Include sidebar/chart tokens only if consumed or required by an installed component. A destructive-foreground value does not make generated components consume it: inspect the actual variant, which may use white or translucent destructive text instead.

The schema permits arbitrary **flat** color names. This starter's convention is unprefixed names for the default/light appearance and `dark-<role>` for dark overrides, if supported. Document this as a local naming convention under Colors/Implementation, not a Google theme feature. Map `colors.primary` to `:root --primary`; `colors.dark-primary` to `.dark --primary`; retain `@theme inline --color-primary: var(--primary)`. Dark values must be designed and checked independently. Do not emit nested `colors.light`, `colors.dark` or a `themes:` schema.

Retain only useful ramp steps. Semantic references may point at flat primitives, e.g. `primary: "{colors.brand-700}"`; test reference resolution with lint/export. Document the seed's provenance and immutable brand constraints. Exact YAML values are canonical; prose describes the roles rather than repeating every number.

## Meaningful mechanical validation

From the repository root:

```sh
pnpm design:lint
pnpm design spec --rules-only --format json
# For a deliberate revision; before-copy is temporary, not a second authority.
pnpm design diff /path/to/before.md DESIGN.md
# Optional diagnostic preview, not a file to overwrite styles.css with.
pnpm design export --format css-tailwind DESIGN.md
```

The dot-free `designmd` executable behind these scripts also avoids Windows `.md` file-association problems. The dev dependency is pinned for repeatability. Upgrade deliberately and recheck the spec/fixtures; the root `pnpm ui` wrapper follows current shadcn independently.

Lint checks declared component `backgroundColor`/`textColor` pairs at 4.5:1. Merely declaring a palette checks no useful foreground/background combinations. Include meaningful component entries for page copy, card/popover text, primary/secondary controls, muted copy, selected/hover states and destructive states in **each supported mode**. Include the real foreground and real background for each; a hover entry with only a background does not test contrast. Reference shared tokens rather than repeating colors. These entries specify appearances, not React files that must be generated.

Fix errors and contrast warnings before calling the design ready. Contrast warnings currently return exit 0, so read the JSON findings. Review every other warning: fix typos, section order and lost values; explain intentional orphaned ramp/border/ring tokens instead of suppressing all warnings or inventing fake text components. `omitted` is for genuinely omitted groups, not hiding failures. `diff` can fail simply because a new unused primitive adds a warning; assess the finding. Export success is not lint success.

Validate fields against the schema too: the alpha parser/linter may silently discard unsupported values or typoed typography properties. Inspect an optional export to confirm intended roles survive. Neither lint nor export compares DESIGN.md with CSS or shadcn configuration.

Observed in 0.4.0: an unresolved alias in an unused color role can escape `broken-ref`, while the same reference used by a component is flagged. Inspect all references, including border/ring roles, instead of treating zero errors as exhaustive schema validation. The `css-tailwind` export also omitted unitless lineHeight in our fixture and quoted a comma-separated font stack as a single family. Preserve valid unitless leading and actual fallback stacks in application CSS; do not change good design tokens just to satisfy the exporter.

The official contrast check is not a complete accessibility audit. Check rendered alpha/opacity/color-mix results, disabled/hover variants, focus indicators, icons and input boundaries against their actual surfaces through better-colors/better-accessibility. Use the applicable WCAG threshold (normally 4.5:1 text, 3:1 qualifying large text and required non-text indicators); explain any justified large-text lint exception. APCA may inform design but does not replace this WCAG gate. Verify keyboard, names, target sizes, reflow/zoom and reduced motion on real UI. Report unavailable runtime checks honestly.

## Why export is optional

`css-tailwind` produces an `@theme` block, not this application's light/dark semantic-variable wiring. It does not know our `dark-` mapping or all prose rules. `css-vars` is also available in 0.4.0 but is not an automatic shadcn adapter. Fonts need actual loading, typography roles may require bundled utilities, and component tokens do not generate React components. Use exports for inspection or an explicitly requested consumer; do not commit redundant export artifacts or replace the existing stylesheet wholesale.
