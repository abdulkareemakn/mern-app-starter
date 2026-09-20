---
title: 404 page
description: Customize the starter's existing not-found screen for URLs that do not match a client route.
---
# 404 page

The starter kit includes a default 404 page at `apps/client/src/pages/404.tsx`.

The root route wires it in through `notFoundComponent` in
`apps/client/src/routes/__root.tsx`:

```tsx
export const Route = createRootRoute({
  // ...existing options
  notFoundComponent: NotFoundPage,
});
```

## Edit the page

`404.tsx` is an ordinary component, so change the markup, copy, and layout freely.
