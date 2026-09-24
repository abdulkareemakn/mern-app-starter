---
title: Recommendations
description: Practical defaults for domains, documentation sites, and API references.
---

# Recommendations

These are opinionated defaults for a small-to-medium web project. Choose the
boring option that solves the current problem, and change it when the project
has a clear reason to do more.

## Domain registrar

Use [Cloudflare Registrar](https://developers.cloudflare.com/registrar/) when
your domain extension is supported and you are happy to use Cloudflare DNS. It
charges the registry and ICANN price without a registrar markup, and includes
WHOIS redaction and one-click DNSSEC.

Use [Porkbun](https://porkbun.com/products/domains) when you need a wider choice
of extensions or prefer a registrar that shows registration, renewal, and
transfer prices together.

Before buying, check the renewal price—not only the first-year promotion—and
turn on two-factor authentication, auto-renewal, and registrar lock.

## Documentation website

Keep documentation in the application repository as Markdown and build a
static site. This keeps docs reviewable with code and avoids a database or CMS
until non-developers genuinely need one.

| Situation | Recommendation |
| --- | --- |
| This starter or a Markdown-first project | [Zensical](https://zensical.org/docs/create-your-site/) |
| React/MDX, versioned docs, or a larger product site | [Docusaurus](https://docusaurus.io/docs/docs-introduction) |
| Vue/Vite or a fast content-focused site | [VitePress](https://vitepress.dev/guide/what-is-vitepress) |

For this repository, keep using Zensical. It already matches the Markdown
content, navigation, preview, and static build workflow here.

## Small-project defaults

- **Hosting:** use the deployment path already documented in [Deployment](/deployment/).
- **Email:** use a transactional provider such as [Resend](https://resend.com/docs) once production email is required.
- **Search:** use the documentation host's built-in search before adding a separate search service.

## References

- [Cloudflare Registrar](https://developers.cloudflare.com/registrar/)
- [Porkbun domain pricing](https://porkbun.com/products/domains)
- [Zensical: create your site](https://zensical.org/docs/create-your-site/)
- [Docusaurus docs introduction](https://docusaurus.io/docs/docs-introduction)
- [VitePress: what is VitePress?](https://vitepress.dev/guide/what-is-vitepress)
