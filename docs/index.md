---
title: Introduction
description: Documentation for the MERN course starter — a pnpm workspace with a typed React client, an Express 5 API, a shared contracts package, MongoDB, and Better Auth sessions.
sidebar:
  label: Introduction
  order: 0
---

# Introduction

The MERN course starter is a pnpm workspace that keeps a typed React client and an
Express 5 API in one repository, shares browser-safe API contracts between them, and
uses Better Auth for email/password sessions backed by MongoDB.

TODO: Replace this paragraph with the framing you want readers to start with — who the
docs are for and what they will build.

<div class="grid cards" markdown>

- [__Installation__](/installation/prerequisites)

    Install the workspace and run the client, server, and database together.
- [__Development__](/development)

    Formatting and linting for the whole workspace.
- [__Guides__](/guides)

    Task-focused walkthroughs: routes, models, pages, and protection.
- [__Reference__](/reference)

    Commands, API endpoints, and the security checklist.
</div>

## What is included

TODO: List the stack and the headline features. Suggested bullets:

- pnpm workspace with `apps/client`, `apps/server`, and `packages/shared`
- React 19 + Vite 8 + TanStack Router (file-based routes)
- Express 5 with async-aware error handling
- MongoDB through Mongoose, plus Better Auth's MongoDB adapter
- Tailwind CSS v4, Biome for formatting and linting

## How to use these docs

TODO: Explain the reading paths. For example: newcomers read Installation; contributors
jump to Guides; operators start with Deployment and Configuration.
