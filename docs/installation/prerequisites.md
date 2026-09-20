---
title: Prerequisites
description: Install Node.js 24+, pnpm 11.3.0, and Docker with Compose before starting the workspace.
---

# Prerequisites

You need Git, Node.js 24 or newer, pnpm 11.3.0, and Docker with Compose. A
GitHub account is only needed if you plan to publish the repository or deploy
the documentation site.

## Git and Node.js

Node.js 24+ is required.

=== "Windows"

    ```sh
    winget install --id Git.Git
    winget install -e --id OpenJS.NodeJS
    ```

=== "macOS"

    ```sh
    brew install git node
    ```

=== "Ubuntu / Debian / Mint"

    ```sh
    sudo apt install git nodejs npm
    ```

=== "Fedora / RHEL"

    ```sh
    sudo dnf install git nodejs npm
    ```

Official install instructions: [Git](https://git-scm.com/downloads) · [Node.js](https://nodejs.org/en/download)


## pnpm

The repository pins pnpm 11.3.0 in the root `package.json`.

```sh
npm install --global pnpm@11.3.0
```

Verify each with:

```sh
git --version
node --version
npm --version
pnpm --version
```

Official install instructions: [pnpm](https://pnpm.io/installation)

## Docker with Compose

Docker runs MongoDB locally and is also used by the full-stack deployment example.

```sh
docker compose version
```

## An editor

Use any editor with TypeScript support. The repository includes shared settings in
`.vscode/`; Biome handles formatting and linting from the workspace root.

## Next steps

Continue to [Installation](/installation/installation).
