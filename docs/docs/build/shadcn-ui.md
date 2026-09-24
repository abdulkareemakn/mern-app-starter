---
title: shadcn/ui
description: Add and maintain shadcn components on the Base UI foundation.
---

# shadcn/ui

This starter kit uses shadcn/ui for interface components. Its CLI copies editable component
source into `apps/client/src/components/ui`, where you own it. The starter uses its Base
UI option because accessible primitives and editable code are a good fit for a starter.

Choose your typography, colors, and icons on [Design and UI](/build/design-system)
before applying a preset. `DESIGN.md` describes the decision; `styles.css` and copied
components implement it.

## Add components

Run commands from the repository root. The wrapper keeps CLI writes inside the client:

```sh
pnpm ui info
pnpm ui add dialog --dry-run
pnpm ui add dialog
pnpm ui docs dialog button --base base
```

Install only what the feature needs. Review generated source, package changes, and the lockfile before committing. `pnpm ui create`/`init` is for initializing another project; this repository is already initialized.

`components.json` records aliases, CSS entrypoint, Base UI, and the selected icon library. It is configuration for future CLI operations, not a runtime component registry.

## Customize components

### Apply design choices

After updating `DESIGN.md`, use the current CLI to implement supported choices:

```sh
pnpm ui apply <preset>
pnpm ui apply <preset> --only theme
pnpm ui apply <preset> --only font
pnpm ui migrate base-color --to zinc
pnpm ui migrate icons --from lucide --to tabler
```

Supported general-purpose icon libraries currently include Lucide, Tabler, Hugeicons, Phosphor, and Remix Icon. Supported base colors include neutral, zinc, stone, mauve, olive, mist, and taupe. Preset styles include Nova, Vega, Maia, Lyra, Mira, and Luma. Check `pnpm ui --help` for the installed CLI version.

Full `apply` can rewrite `components.json`, the theme CSS, utility code, dependencies, and generated components. Commit first and inspect the diff. `--only theme,font` is the safer path when the rest of the implementation is already established. Base UI remains the primitive library unless you explicitly choose another supported base.

### Compose components

Use the generated component API and the existing `cn` helper. Base UI composition uses `render`, not Radix's `asChild`:

```tsx
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

<Button render={<Link to="/" />} nativeButton={false} variant="outline">
  Home
</Button>
```

Keep reusable primitives in `components/ui` and feature compositions in `components`. Preserve labels, keyboard focus, disabled states, and status announcements when customizing forms.

## Verify changes

```sh
pnpm design:lint
pnpm check
pnpm --filter @mern/client typecheck
pnpm --filter @mern/client build
```

Test keyboard navigation, focus containment and return for overlays, disabled/error states, dark mode, and narrow screens. If generated code disagrees with `DESIGN.md`, update the implementation or the documented intent deliberately; do not let copied component defaults become an accidental second source of truth.

## Next step

Continue to [Build your app](/build/) when your design direction is ready.

## References

- [shadcn/ui documentation](https://ui.shadcn.com/docs)
- [Base UI](https://base-ui.com/)
- [Design and UI](/build/design-system)
