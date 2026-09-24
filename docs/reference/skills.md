---
title: Agent skills
description: The repository-local skills available to coding agents and the work they guide.
---

# Agent skills

These skills live in `.agents/skills/` in the application repository. They guide
coding agents; they are not runtime dependencies of the application.

The `better-*` skills are integrated in the primary repository at
`/home/abdulkareem/code/mern/.agents/skills/`. They are not copied into this
documentation repository; this repo documents the application repository's
skills and links to them.

## Interface and design

| Skill | Covers |
| --- | --- |
| `better-accessibility` | Accessibility reviews, keyboard use, forms, hit areas, zoom, and screen readers |
| `better-colors` | Color tokens, palettes, formats, and contrast |
| `better-interface` | A complete interface review across accessibility, layout, color, typography, UI, and writing |
| `better-layout` | Grouping, alignment, spacing, reading order, and responsive layout |
| `better-typography` | Font choices, type scale, spacing, wrapping, truncation, and OpenType details |
| `better-ui` | Surface depth, radii, icons, motion, hit areas, and UI polish |
| `better-writing` | Product copy and interface text |
| `design-md` | Creating and validating `DESIGN.md` and keeping shadcn and CSS aligned |
| `shadcn` | Adding, searching, migrating, styling, and composing shadcn components |

## Authentication and security

| Skill | Covers |
| --- | --- |
| `better-auth-best-practices` | Better Auth setup, adapters, sessions, plugins, and environment configuration |
| `better-auth-security-best-practices` | Rate limiting, CSRF, trusted origins, secure cookies, OAuth tokens, and audit logging |
| `create-auth` | Scaffolding authentication flows and Better Auth route and UI integration |

## Project operations

| Skill | Covers |
| --- | --- |
| `vercel-react-best-practices` | React and Next.js performance patterns |
| `wizard` | Interactive guides for credentials, infrastructure, and one-off human-only setup |
| `privacy-page-generator` | Privacy policy and data-protection pages |
| `terms-page-generator` | Terms of Service and user-agreement pages |

Use a skill when the task matches its scope. The repository code and `DESIGN.md`
remain the source of truth, and skills do not replace formatting, linting,
typechecking, or tests.

## References

- [Code quality](/quality/)
- [Project structure](/installation/project-structure)
