---
title: Design and UI
description: Make a few durable design decisions before building screens or adding components.
---

# Design and UI

The starter kit starts with neutral design defaults so each product can choose its own visual direction. Choose that direction before adding more components. A product needs a clear personality, readable text, and predictable controls. Decide what you are making, how it should feel, its color direction, density, corner style, and icon style.

Execute the `design-md` skill to turn these human choices into a practical `DESIGN.md`. That file is the source of truth. `apps/client/src/styles.css` implements the tokens; shadcn/ui implements editable components that use them.

The design system intentionally asks for only a few durable preferences; the AI agent carries those choices through the type scale, spacing, components, icon usage, and interface copy.

## Apply the decision

Ask an agent to use `design-md`, review the resulting `DESIGN.md`, then run:

```sh
pnpm design:lint
pnpm ui info
```

## Next step

Continue to [shadcn/ui](/build/shadcn-ui) to add components that follow these choices.

## References

- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)

Related: [shadcn/ui](/build/shadcn-ui)
