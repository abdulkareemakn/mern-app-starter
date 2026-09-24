---
title: Security checklist
description: Confirm these settings before exposing an environment to real users.
---

# Security checklist

Run this checklist before exposing an environment to real users.

## Secrets

- [ ] `BETTER_AUTH_SECRET` is unique per environment and at least 32 characters.
- [ ] `.env` is not committed; only `.env.example` is.
- [ ] No secret uses the `VITE_` prefix.

## Origins and cookies

- [ ] `APP_URL` and `BETTER_AUTH_URL` are the same public HTTPS origin.
- [ ] No wildcard trusted origin is configured.

## Proxy and rate limiting

- [ ] `TRUST_PROXY` lists only your own ingress addresses.
- [ ] The proxy overwrites forwarded client-IP headers.

## Data

- [ ] MongoDB is not publicly reachable.
- [ ] Backups exist for the database volume.
- [ ] The integration test database has permission to be created and dropped, and the
  application database does not rely on that permission.

## Application code

- [ ] Every private endpoint checks the session on the server.
- [ ] Request bodies are validated before use.

## References

- [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)
- [Authentication](/build/authentication)
