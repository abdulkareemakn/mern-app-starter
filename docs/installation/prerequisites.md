---
title: Prerequisites
description: Install Node.js 24+, pnpm 11.3.0, and a local MongoDB server before starting the workspace.
---

# Prerequisites

You need Git, Node.js 24 or newer, pnpm 11.3.0, and MongoDB. On Windows, install
MongoDB Community Server directly; on macOS and Linux, run it with Docker Compose.
A GitHub account is only needed if you plan to publish the repository or deploy the
documentation site.

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

## MongoDB

=== "Windows"

    Download [MongoDB Community Server](https://www.mongodb.com/try/download/community)
    for Windows as an MSI. In the installer, choose **Complete** and keep **Install
    MongoD as a Service** selected. The service starts when installation finishes and
    listens on `127.0.0.1:27017` by default.

    `mongosh` is optional for this project; install it separately only if you want a
    database shell.

=== "macOS / Linux"

    Install Docker Desktop (macOS) or Docker Engine with the Compose plugin (Linux).
    Docker runs the local MongoDB server and is also used by the full-stack deployment
    example.

    ```sh
    docker compose version
    ```

## An editor

Use any editor with TypeScript support. The repository includes shared settings in
`.vscode/`; Biome handles formatting and linting from the workspace root.

## Next steps

Continue to [Installation](/installation/installation).
