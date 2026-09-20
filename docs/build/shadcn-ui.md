---
title: shadcn/ui
description: Add, customize, and maintain shadcn components built on Base UI in this workspace.
---

# shadcn/ui

The frontend uses **shadcn/ui with Base UI**, the Nova style, and a neutral theme. Button, Input, Label, and Card are installed and used by the auth page. Component source lives in your repository: you can edit it directly.

## Run the CLI

All examples below run from the repository root. `pnpm ui` changes into `apps/client` and runs `pnpm dlx shadcn@latest`. It keeps CLI writes in the frontend. The setup was verified with shadcn **4.21.0** on September 20, 2026.

```sh
pnpm ui info
pnpm ui add dialog --dry-run
pnpm ui add dialog
pnpm ui add checkbox select
pnpm ui docs dialog button --base base
pnpm ui search @shadcn --query "dialog"
```

`info` should report `style: base-nova`, `base: base`, and TypeScript enabled. Adding a component copies its source and installs its required dependencies. Inspect the resulting files and root lockfile before committing. Install components as you need them; there is no need to add the entire registry.

The equivalent direct command is `pnpm dlx shadcn@latest add dialog --cwd apps/client`. To use the installed, lockfile-controlled CLI instead of fetching the latest CLI, run `pnpm --filter @mern/client exec shadcn add dialog`.

The [CLI reference](https://ui.shadcn.com/docs/cli) lists all commands. `pnpm ui <command> --help` is the authority for the version you are running.

## Initialization is already complete

Students cloning this template only need `pnpm install`. Do not run `init` again as part of routine setup.

For a different, uninitialized Vite project, the current initialization command selects the primitive library and visual preset separately:

```sh
pnpm dlx shadcn@latest init --base base --preset nova
```

The resulting style is `base-nova`. Keep TypeScript enabled and point the CSS setting to that project's Tailwind entry. This workspace already has the required aliases and Tailwind Vite plugin. The CLI's `init` path prompted for legacy options in this workspace, so this template uses explicit configuration plus the official Base UI style registry and theme application instead. There is no Radix migration required.

## Understand components.json

`apps/client/components.json` configures future CLI operations; it is not a runtime component catalog.

| Setting | This template |
| --- | --- |
| `$schema` | Editor validation from shadcn's schema |
| `style` | `base-nova`: Base UI primitives and Nova styling |
| `rsc` / `tsx` | `false` / `true`: a TypeScript React SPA |
| `tailwind.config` | Empty because this project uses Tailwind CSS v4 |
| `tailwind.css` | `src/styles.css`, the theme and Tailwind entry |
| `tailwind.baseColor` / `cssVariables` | `neutral` / `true` |
| `tailwind.prefix` | Empty; utilities have no custom prefix |
| `aliases.ui` / `aliases.components` | `@/components/ui` / `@/components` |
| `aliases.utils` / `aliases.lib` / `aliases.hooks` | `@/lib/utils` / `@/lib` / `@/hooks` |
| `iconLibrary` | `lucide` |
| `rtl` | `false` |
| `menuColor` / `menuAccent` | `default` / `subtle` |
| `registries` | Empty; the built-in `@shadcn` registry still works |

The `@/*` alias maps to `src/*` in the client's `tsconfig.json`; Vite reads those paths through `resolve.tsconfigPaths`. Keep aliases and real file locations aligned. Changing `style` alone does not migrate already copied components. Use the [configuration reference](https://ui.shadcn.com/docs/components-json) when extending the setup.

UI components stay in the client because there is one frontend. `@mern/shared` remains a browser-safe contracts package, not a component package.

## Use and customize components

```tsx
import { Button } from "@/components/ui/button";

<Button type="submit" variant="outline" size="sm" className="w-full">
  Save changes
</Button>
```

Use props and `className` for a local adjustment. Edit `src/components/ui/button.tsx`, including its `buttonVariants`, when every button should change. Build feature-specific compositions in `src/components`, keeping reusable primitives in `src/components/ui`.

The current registry imports its class-merging helper from `cn`; `src/lib/utils.ts` re-exports that helper for application code. Preserve the existing helper instead of adding another class-name utility. Keep labels associated with input IDs, keyboard focus styles, disabled behavior, and status/error announcements when customizing a form.

Base UI composition uses `render`. For example, the existing home route can be rendered as a button-styled link:

```tsx
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

<Button render={<Link to="/" />} nativeButton={false} variant="outline">
  Home
</Button>
```

`nativeButton={false}` identifies the rendered anchor. Do not copy Radix `asChild` examples into Base UI components. Consult the [Base UI Button documentation](https://ui.shadcn.com/docs/components/base/button) and the [Base UI composition guide](https://base-ui.com/react/handbook/composition) for the selected primitive's API.

## Change the theme

Edit the semantic color variables in `src/styles.css`: `:root` contains light values, `.dark` contains dark values, and `@theme inline` connects them to Tailwind utilities. Use classes such as `bg-background`, `text-muted-foreground`, and `border-input` so both palettes work. Change `--radius` for the theme's radius scale. The template uses the system font stack.

The stylesheet imports Tailwind, `tw-animate-css`, and `shadcn/tailwind.css`. Keep those imports and their dependencies. Avoid broad, unlayered `button` or `input` rules: they can override component styles.

Dark tokens are installed, but no theme switcher or persistence is added. Adding the `dark` class to the document's root enables that palette. Follow the [Vite dark-mode guide](https://ui.shadcn.com/docs/dark-mode/vite) when your project needs a theme control.

To inspect or apply a preset theme:

```sh
pnpm ui preset resolve
pnpm ui apply b2fA --only theme
```

`b2fA` is the neutral preset used here. Applying a theme updates tokens, so commit your customizations first and review the diff afterward. See [theming](https://ui.shadcn.com/docs/theming) for the token model.

## Review upstream changes

Copied component files do not automatically update when a package is updated. Preview the registry version before replacing a customized file:

```sh
pnpm ui add button --diff
pnpm ui add button --view
pnpm ui add button --dry-run
```

Merge useful changes into your local file. If you deliberately want a full replacement, commit or back up your edits first, then run `pnpm ui add button --overwrite`. That flag replaces local component code. The old standalone `diff` command is deprecated in the current CLI.

The `shadcn` package is also a frontend development dependency because the stylesheet imports its Tailwind helpers. Runtime primitives come from `@base-ui/react`; updating these packages is separate from updating copied component source. Review their release notes and the generated lockfile when upgrading.

## Verify the result

```sh
pnpm check
pnpm --filter @mern/client typecheck
pnpm --filter @mern/client build
pnpm ui info
```

Run the app and check keyboard navigation, form validation, disabled states, and narrow-screen layout. For overlays, also check Escape, focus return, and focus containment. Commit component source, `components.json`, the stylesheet, manifests, and the root `pnpm-lock.yaml` together.
