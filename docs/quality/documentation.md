---
title: Documentation
description: Build and maintain this documentation site.
---

# Documentation

The docs live in the companion `mern-docs` repository and are built with Zensical. Keep examples aligned with the application repository and remove temporary markers before publishing.

```sh
zensical serve
zensical build --clean
```

The GitHub Pages workflow builds the site on documentation changes. Check navigation and internal links locally, keep code examples copyable, and link to the application source when a behavior is implementation-specific. Update the relevant page when commands, environment variables, deployment providers, or generated configuration change.
