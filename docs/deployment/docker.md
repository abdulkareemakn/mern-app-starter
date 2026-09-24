---
title: Docker
description: Build the production image or run the complete application and MongoDB stack with Docker Compose.
---

# Docker

This starter kit includes a multi-stage `Dockerfile` that builds the client and server, then creates a
smaller production image that runs as the non-root `node` user. Environment files are
excluded from the image; provide secrets only at runtime.

## Build the image

From the repository root:

```sh
docker build -t mern-template .
```

Every push to the application repository also runs `.github/workflows/docker.yaml`. GitHub Actions builds the image with Buildx, tags it with the commit SHA, and caches layers; it does not publish to a registry or need runtime secrets. Add registry login and `push: true` only when you have chosen a registry and secret policy.

The image contains the compiled server and `apps/client/dist`. It expects a reachable
MongoDB instance plus the production settings from [Production build](/deployment/production-build).

## Run the complete stack

For a local stack, copy `.env.example` to `.env`. Set a generated `BETTER_AUTH_SECRET`, set `RESEND_API_KEY`, and set both `APP_URL` and `BETTER_AUTH_URL` to `http://localhost:3000`. For a public host, use its real HTTPS origin for both URLs and provide the secrets through the host. Then run:

```sh
pnpm docker:up
```

This runs `compose.yaml`: one app image, Express serving the SPA and API, and MongoDB
on an internal network with a persistent volume. The app is published on port 3000 by
default; change `APP_PORT` to use another host port. Stop `pnpm dev:ui` first if it is using
that port.

## Data and volumes

Stop the stack with:

```sh
pnpm docker:down
```

This preserves its `mongo-data` volume. `docker compose down --volumes` permanently
deletes the full-stack database. The local development database below uses a separate
Compose project and volume, so it does not share accounts or data with this stack.

## Local development database

Use `compose.db.yaml` when development runs on your machine but MongoDB runs in Docker:

```sh
pnpm db:up
pnpm db:down
```

It runs MongoDB 8.0 with a health check and exposes port 27017 only on loopback.

## What the template does not do

This is a single-host reference. It does not provision DNS, TLS, backups, or a managed
database. For production, use MongoDB Atlas instead of the Compose
database when you need managed backups and availability: set `MONGODB_URI` to the Atlas
SRV URI and do not expose a local MongoDB port. Put the app behind your provider's HTTPS
ingress or reverse proxy and inject secrets through the deployment platform.

## Next step

Use the [Security checklist](/reference/security-checklist) before exposing the stack to users.

## References

- [Docker Compose](https://docs.docker.com/compose/)
- [Security checklist](/reference/security-checklist)
