---
title: Security checklist
description: Confirm these settings before exposing an environment to real users.
---

# Security checklist

TODO: Introduce the page — a short list to run through before a deployment goes public.

## Secrets

- TODO: `BETTER_AUTH_SECRET` is unique per environment and at least 32 characters.
- TODO: `.env` is not committed; only `.env.example` is.
- TODO: No secret uses the `VITE_` prefix.

## Origins and cookies

- TODO: `APP_URL` and `BETTER_AUTH_URL` are the same public HTTPS origin.
- TODO: No wildcard trusted origin is configured.

## Proxy and rate limiting

- TODO: `TRUST_PROXY` lists only your own ingress addresses.
- TODO: The proxy overwrites forwarded client-IP headers.

## Data

- TODO: MongoDB is not publicly reachable.
- TODO: Backups exist for the database volume.
- TODO: The integration test database has permission to be created and dropped, and the
  application database does not rely on that permission.

## Application code

- TODO: Every private endpoint checks the session on the server.
- TODO: Request bodies are validated before use.

## Next steps
