---
title: Introduction
description: Documentation for the MERN course starter, a pnpm workspace with a typed React client, an Express 5 API, shared contracts, MongoDB, and Better Auth sessions.
sidebar:
  label: Introduction
  order: 0
---

# Build a MERN app without starting from zero

The MERN course starter gives you a working React application, Express API, MongoDB
database, authentication, emails and emails in one repository. You can begin building your project
instead of spending your first week wiring tools together.

The decisions for the tech stack have been made to simplify development, avail free tiers and use well known and reliable products used by millions of developers.
See the [__reference__](/reference/tech-stack) for the complete tech stack

Read this site in order if this is your first full-stack app. It starts with getting
the project running, then covers the decisions that shape its interface, followed by
the parts users depend on most: accounts, data, and safe API input.

<div class="grid cards" markdown>

- [__Start here__](/installation/prerequisites)

    Install the workspace and run the client, server, and database together.


- [__Design and UI__](/build/design-system)

    Choose a visual direction before generating components or writing screens.

- [__Build your app__](/build)

    Build authentication, data, routes, UI, validation, and email features.
- [__Code quality__](/quality)

    Formatting, linting, tests, and documentation for the whole workspace.
- [__Deployment__](/deployment)

    Deno Deploy with MongoDB Atlas, Docker Compose, and production builds.
- [__Reference__](/reference)

    Commands, API endpoints, the security checklist, and starter references.
</div>

## What is included

- pnpm workspace with `apps/client`, `apps/server`, and `packages/shared`
- React 19 + Vite 8 + TanStack Router (file-based routes)
- Express 5 with async-aware error handling and Better Auth sessions
- MongoDB through Mongoose, plus Better Auth's MongoDB adapter
- React Email templates, Resend delivery, and Tailwind CSS v4
- Biome formatting and linting, plus Node-based tests

## How to use these docs

Newcomers should read Start here, Design and UI, then Build your app. Contributors can
use Code quality as their finishing checklist; operators can start with Deployment.

## References

- [React](https://react.dev/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/docs/)
- [Zensical](https://zensical.org/)
