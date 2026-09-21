---
name: design-md
description: Establish, document, evolve, or validate this starter's design system in Google's DESIGN.md format, keeping Base UI shadcn configuration and application CSS aligned. Guides a few student choices and derives detailed tokens. Use for design-system work, not every component addition.
---

# A design system from a few decisions

Create or maintain the repository-root `DESIGN.md` as the canonical design intent. Implement it in this existing React/Tailwind v4/shadcn application. Do not design a demonstration application or manufacture screens to audit.

## Load the owners

Read the installed [shadcn skill](../shadcn/SKILL.md) for CLI operations and component conventions. Read [better-interface](../better-interface/SKILL.md) for domain ownership, then load `better-accessibility`, `better-layout`, `better-writing`, `better-typography`, `better-colors`, and `better-ui` from sibling directories. Use their relevant references, not copies of their manuals.

For creation, use these domain skills as design expertise; do not invoke review reports against an imaginary UI. For an existing screen review, use better-interface's evidence and coverage rules. A diff/PR review belongs to its user-invoked `interface-review` route, not an automatic extra task. Missing owner: report the missing expertise and locate/install it before claiming full coverage. The upstream package is `jakubkrehel/skills`; never depend on another student's home directory.

Read [format-and-validation.md](references/format-and-validation.md) before authoring and [shadcn-integration.md](references/shadcn-integration.md) before applying changes. Run `pnpm design spec`; inspect current CLI help when upgrading tools. Upstream is alpha. The official spec and CLI take precedence over third-party examples. Keep Base UI, Tailwind, CSS-variable theming, and the application architecture.

## 1. Inspect and choose the mode

Read applicable AGENTS.md, existing DESIGN.md, root/client package manifests, `apps/client/components.json`, `apps/client/src/styles.css`, font/icon imports, and installed components. Run `pnpm ui info --json` and `pnpm ui preset resolve --json`. Inspect actual font loading: preset `fallbacks` are guesses, not installed fonts.

- **Fresh:** only starter/demo UI or no meaningful product direction. Inspect technical configuration only. Nova, Neutral, Lucide and system fonts are replaceable starting points, not the student's decisions.
- **Existing:** inspect meaningful product UI and relevant states as well as configuration. Establish whether the student wants to **preserve/document**, **evolve**, or **replace** before redesigning. Reuse an already stated intent. Preserve means record what exists, flag discrepancies/accessibility failures, and do not repaint silently.

Identify local component modifications and dirty files before migrations. Preserve unrelated work.

## 2. Ask for taste, not token values

Use what the student already supplied. Start with a compact prompt:

> What are you building, who uses it, and should it feel calm/professional, warm/friendly, or bold/playful? Share any colors, fonts, or reference you like; “recommend for me” is fine.

Then propose **one** coherent direction, with a small alternative only where useful. Bundle optional density, rounding, font character, icon character and light/dark needs into the recommendation. Explain consequential tradeoffs plainly: compact fits more information; comfortable gives touch targets room; a display font adds character but needs a readable body partner. The student can accept, change a preference, or delegate taste. Do not turn this matrix into a questionnaire.

| Area | Human input, only if needed | Agent derives | shadcn | DESIGN.md | CSS/code and validation |
| --- | --- | --- | --- | --- | --- |
| Direction | Product, audience, character; preserve/evolve/replace | Hierarchy, suitable style | Preset style/menu treatment | Overview; implementation prose | CLI info, diff; meaningful UI if any |
| Color | Neutral/accent direction, seeds/scales; needed appearances | Roles, readable shades, states, danger/status colors | Base/theme baseline | Flat colors + mapping rationale | Theme variables; lint pairs, rendered contrast |
| Type | Font/character, languages | Roles, scale, weights, leading, tracking, features | Supported body/heading fonts | Typography + responsive prose | Imports/utilities; lint, export, font loading/zoom |
| Density/layout | Compact/comfortable if not inferable | Rhythm, gutters, measure, responsiveness | Style baseline only | Spacing + Layout | Tailwind scale/layout; reflow, hit targets |
| Shape | Sharp/soft/rounded if desired | Radius family, nesting | Preset radius | Rounded + Shapes | Radius variables; compare derivations |
| Depth/motion | Only special constraints | Depth, feedback, reduced motion | Component defaults | Elevation; motion prose | CSS as needed; state/reduced-motion checks |
| Components | Actual tasks | Relevant variants, geometry, states | Base UI components | Tokens and guidance | Shared variants; typecheck, keyboard, contrast |
| Interface icons | Character or supported library if desired | One family, sizes, accessible use | Icon migration | Iconography prose | Imports, CLI info, typecheck |
| Brands | Actual identities | Simple Icons exports or official assets | No | Iconography prose | On-demand dependency; exports/build |

Summarize the direction before mutations. For destructive preset replacement, explain the files at risk and resolve overwrite/merge/partial/skip through the official shadcn skill. Reuse explicit authorization already given; do not require students to understand CLI internals.

## 3. Derive the system

- **Color:** one neutral scale and one accent scale. Coolors collections may be unrelated swatches, not ramps: identify seeds and derive missing role values using better-colors. Prefer supplied/established ramps; custom interpolation uses its recommended color tooling temporarily, not a new app dependency. Preserve fixed brand values; use another shade for readable text/fills if needed. Map roles yourself. `primary` is the main action; shadcn `accent` is a hover/selection surface and need not equal the brand seed. Secondary/muted roles normally use neutrals. Keep danger recognizable and distinct from brand actions, with words/icons as well as color. Add success/warning/chart palettes only for real semantics.
- **Type:** use roles this product needs, not a mandatory 9–15-role template. Derive rem sizes, unitless leading, em tracking, fallbacks and loaded weights. Preserve browser text scaling. Use fluid display sizing only if helpful; record endpoints in tokens and formulas in prose/CSS. Verify language coverage and supported font axes/features. Prefer CSS properties to raw OpenType tags where equivalents exist.
- **Spacing/layout:** reuse Tailwind's scale where it fits; record chosen steps and their jobs. Derive grouping, measure, widths, gutters and content-driven breakpoints. Density cannot erase accessible targets, wrapping or zoom support.
- **Shapes/depth/motion:** derive a small radius family from the style and roundness; inspect actual CSS formulas. Define only useful elevations. Record focus, transitions, timing/easing and reduced motion in prose; implement relevant rules in the existing stylesheet/shared components. Do not add a motion library.
- **Components/icons:** specify existing and immediately needed atoms and states; use shared variants instead of leaf overrides. Use one shadcn-supported general icon family. Brands are the explicit exception: named `react-icons/si` exports when needed. Record `## Iconography`, not an invented YAML icon schema.

## 4. Record, implement, reconcile

Write the full draft DESIGN.md with normative tokens, rationale, iconography and a short `## Implementation` section: selected shadcn style/base/icon family, font sources, mode mapping and intentional customizations. A preset code may record provenance; it is not the canonical token system.

Apply supported changes through shadcn, then implement remaining DESIGN.md values in `apps/client/src/styles.css` and only necessary shared component/application code. Re-read changed files. Reconcile generated defaults with approved tokens after every CLI operation; ownership does not change because the CLI wrote last.

**Conflict rules:**

1. Explicit user changes update DESIGN.md and implementation together. YAML values are normative; fix contradictory prose.
2. Existing DESIGN.md wins over accidental CSS/config drift. Report the mismatch and repair implementation within scope. If evidence suggests an intentional undocumented redesign, resolve preserve/evolve/replace before replacing it.
3. Without DESIGN.md, meaningful UI is evidence, not permission to redesign. With only starter defaults, derive the new direction.
4. Unsupported choices belong in CSS/prose, not fake `components.json` fields. Explain any implementation limitation before claiming synchronization.
5. Keep one canonical DESIGN.md. Do not commit a second token JSON, generated theme stylesheet or preset manifest. CSS necessarily implements tokens; record its mapping once in DESIGN.md and compare during every system change.

## 5. Verify and hand off

Run `pnpm design:lint`; inspect findings, not just exit status. Follow the validation reference to cover actual color pairs in every supported appearance, fix broken references/contrast failures, and account for intentionally unused primitives. For updates, compare a temporary before-copy with `pnpm design diff <before> DESIGN.md` when useful; investigate regressions instead of blindly chasing warning counts.

Compare DESIGN.md against shadcn info, font/icon imports, CSS mode blocks and shared variants. Check typography including weight/leading, spacing and radius derivations, not only colors. Run `pnpm check`, `pnpm typecheck`, and `pnpm build`. Review affected meaningful UI for focus/keyboard, rendered contrast, 320px reflow, 200% zoom, font loading and reduced motion. With no product UI, report runtime product review pending; do not create a demo for a verdict.

Report decisions, files, checks and unverified coverage concisely. Future UI work reads DESIGN.md first, uses semantic utilities/configured icons and the official shadcn skill for new components. Extend the system only for a real new role, updating DESIGN.md and implementation together.
