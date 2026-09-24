---
title: Icons
description: Choose one coherent icon system and add brand marks only when needed.
---

# Icons

Pick an icon style that fits the product, then let the agent apply it
consistently. The starter uses [Lucide](https://lucide.dev/) for interface icons
because it works with shadcn/ui and gives the UI one clear visual language.

Other useful libraries include:

- [Tabler Icons](https://tabler.io/icons)
- [Phosphor](https://phosphoricons.com/)
- [Hugeicons](https://hugeicons.com/)
- [Remix Icon](https://remixicon.com/)
- [Heroicons](https://heroicons.com/)
- [Radix Icons](https://www.radix-ui.com/icons)
- [Material Symbols](https://fonts.google.com/icons)
- [Font Awesome](https://fontawesome.com/icons)
- [Iconoir](https://iconoir.com/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)

Use one primary library for product UI. Mixing several visual styles makes
buttons, navigation, and empty states feel inconsistent unless the difference
has a deliberate job.

## Social and brand icons

Use [Simple Icons](https://simpleicons.org/) for company and social marks.
[React Icons](https://react-icons.github.io/react-icons/) exposes many icon
libraries through one package, with each icon available as an individual SVG
React component that can be imported by name.

Install it only when the product needs brand icons:

```sh
pnpm --filter @mern/client add react-icons
```

Import only the symbol you use:

```tsx
import { SiGithub } from "react-icons/si";

<a href="https://github.com/example" aria-label="GitHub">
  <SiGithub aria-hidden="true" />
</a>;
```

An icon next to visible text is decorative. Icon-only controls need an
accessible name, a visible focus state, and a hit area large enough to use.

## Let the agent do the rest

You only need to choose the primary style and call out any required brand
icons. The AI agent can select the specific icon, size, stroke or fill
treatment, spacing, and motion rules for the rest of the interface.

Related: [Design and UI](/build/design-system), [UI skill](/reference/skills).
