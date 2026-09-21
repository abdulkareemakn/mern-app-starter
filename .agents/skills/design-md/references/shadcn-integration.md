# Existing-project shadcn integration

Verified with shadcn 4.21.0 on 2026-09-20. Read the [installed official skill](../../shadcn/SKILL.md), its CLI/customization references and current [official CLI docs](https://ui.shadcn.com/docs/cli) when operating. This reference records the starter's integration boundaries, not a replacement shadcn manual.

## Inspect, then select

`pnpm ui` already runs the current CLI in `apps/client`. Use it from the repository root. `pnpm ui info --json` resolves Base UI, Tailwind v4, CSS path, aliases and installed components. `pnpm ui preset resolve --json` reports preset approximations/fallbacks; custom CSS and system fonts cannot necessarily round-trip through a preset code.

The [Create builder](https://ui.shadcn.com/create) is useful for choosing a preset visually. Let students choose there or describe their preferences to the agent. Use CLI `preset decode <code>` / `preset url <code>` to inspect/share codes; never manually encode them. Codes do not encode the primitive base. This app remains **Base UI**. Do not scaffold another app, change router, or run `create --name`.

Current styles: Nova, Vega, Maia, Lyra, Mira, Luma. Current general icon choices: Lucide, Tabler, Hugeicons, Phosphor, Remix Icon (`remixicon`); migrations also support legacy Radix icons. Radix **icons** are separate from Radix primitives, but do not recommend the legacy set for a fresh system. Current base colors: neutral, zinc, stone, mauve, olive, mist, taupe. Recheck these upstream lists before offering choices after a CLI update.

Presets cover style, base color, theme/accent, chart color, icon library, body and heading font, radius, and menu treatment. Derive menu/chart choices unless the product makes them meaningful. Fonts/radius are implemented by CLI-managed CSS/font setup, not invented `font`/`radius` keys in components.json. The style influences density and component geometry, but does not implement a complete layout or type-role system. Custom palettes/fonts remain possible through CSS; record the nearest generation baseline and actual override in DESIGN.md.

## Operation boundaries

Check `--help` before use. The official skill owns the overwrite/partial/merge/skip decision and smart merging. Read diffs and secure authorization for destructive replacement; a full apply has no `--dry-run` flag. For a preview, use a disposable copy that preserves this client's config and dependencies, then compare its output.

| Intent | Existing-project operation | Expected write scope / caution |
| --- | --- | --- |
| Full style/preset change | `pnpm ui apply <preset>` | Preset-driven components.json, theme CSS, fonts, detected UI files, utility source such as src/lib/utils.ts, dependencies/lockfile. Keeps current base and RTL. Can overwrite local component edits. |
| Theme or font only | `pnpm ui apply <preset> --only theme`, `--only font`, or `--only theme,font` | Selected config/theme/font setup; fonts can touch imports, package manifest/lockfile. Does not reinstall UI. No `--only icon`, `--only radius` or `--only style`. Recheck resulting radius/menu values. |
| Preserve modified component code while changing style | Official skill's `init --preset <preset> --force --no-reinstall` followed by per-component `add --dry-run` / `--diff` and smart merge | Config/CSS/font baseline changes first; components stay stale until merged. Keep Base UI (explicit `--base base` for scratch initialization). Do not call a config-only skip a completed style migration. |
| General icon family only | `pnpm ui migrate icons --from <old> --to <new>` | Rewrites UI-directory imports/JSX, installs target dependency, updates iconLibrary. Scan application code too; scoped path/glob migrations do **not** update components.json. Unmapped icons remain and must be resolved. Remove old dependency only after all consumers are gone. |
| Base neutral only | `pnpm ui migrate base-color --to <color>` | Rewrites matching source theme variables and baseColor config. Custom values remain and are reported; reconcile with DESIGN.md instead of assuming every token changed. |
| Custom tokens or radius | Edit existing theme CSS according to official customization guidance | Existing `:root`, `.dark`, `@theme inline`, font rules and shared variants. No re-scaffolding. Inspect radius formulas; don't assume all styles derive radius identically. |
| Add a component | `pnpm ui add @shadcn/<component>` | Component source, possible CSS/dependencies. Preview with `--dry-run`; use `--diff` for existing files. Read output and reconcile with DESIGN.md. |

`create` is an alias of `init`, not a special existing-project theme editor. A base/primitive switch is an architectural migration and out of scope; the `radix` migration consolidates Radix package imports, it does not convert Base UI components. CSS-variable mode and structural setup (paths/aliases/framework) should remain as initialized. Style and base color can change later through the supported workflows above; changing their JSON strings alone does not migrate installed components. Preserve custom utilities and actual font loading when CLI output changes CSS.

## Synchronization checklist

1. Before: capture DESIGN.md plus the affected config/CSS/component changes safely, excluding secrets. Inspect existing local edits.
2. After CLI operations: compare selected style, icon family, base and baseColor with DESIGN.md's implementation notes. Check added fonts actually load in this Vite app, and remove any body rule that overrides the chosen family only when implementing that font change. A font-only apply can retain the old font import/package (observed when switching Inter to Geist); remove unused imports and then unused packages after checking all consumers, or both font families ship.
3. Reapply approved custom semantic colors, radius/type/spacing rules to existing CSS after generated defaults. Match the `.dark` mode contract and `@theme inline` utilities. Check shared components actually consume every role promised by DESIGN.md, especially destructive text and focus opacity.
4. Scan all app icon/font consumers, not just components/ui. Review stylesheet, manifests, lockfile and source diff, then lint DESIGN.md and run repository checks. No new manifest duplicating DESIGN.md is needed.

## Brand/social icons

`react-icons` provides per-set ESM entry points and `sideEffects: false`; named imports from `react-icons/si` allow modern Vite production builds to eliminate unused icons. The installed package contains many icons on disk; tree shaking concerns the shipped bundle. Avoid namespace/dynamic string lookups and root-pack imports. Do not install the older `@react-icons/all-files` workaround.

Install only when a real brand icon is needed:

```sh
pnpm --filter @mern/client add react-icons
```

```tsx
import { SiGithub } from "react-icons/si";
// Inside the existing shadcn Button, with a visible label:
<SiGithub data-icon="inline-start" aria-hidden="true" />
```

Check the installed exports before choosing names (brands can be removed or renamed; never assume `SiLinkedin` or `SiX` exists). If absent, use the brand's official SVG asset rather than a second general-purpose icon pack. Use visible text or an accessible name on an icon-only control. Keep brand artwork faithful to its identity; ordinary UI icons use the configured family and semantic currentColor. This is the explicit brand exception to shadcn's general icon-library rule, not permission to mix `react-icons/fa`, `fi`, `lu`, etc. for interface controls.

Sources: [react-icons imports](https://github.com/react-icons/react-icons#usage), [package metadata](https://github.com/react-icons/react-icons/blob/master/packages/react-icons/package.json). Record the chosen policy in DESIGN.md's Iconography prose; no YAML icon extension or icon wrapper framework.
