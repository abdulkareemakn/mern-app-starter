---
title: Introduction
description: Documentation for the MERN course starter, a pnpm workspace with a typed React client, an Express 5 API, shared contracts, MongoDB, and Better Auth sessions.
sidebar:
  label: Introduction
  order: 0
---

# Introduction

The MERN course starter is for building a production-shaped application without first
assembling a toolchain. It keeps a typed React client and Express 5 API in one pnpm
workspace, shares browser-safe API contracts between them, and uses Better Auth with
MongoDB-backed sessions.

<div class="grid cards" markdown>

- [__Installation__](/installation/prerequisites)

    Install the workspace and run the client, server, and database together.

- [__Build your app__](/build)

    Design system, authentication, data, routes, UI, validation, email, and configuration.
- [__Deployment__](/deployment)

    Deno Deploy with MongoDB Atlas, Docker Compose, and production builds.
- [__Code quality__](/quality)

    Formatting, linting, and tests for the whole workspace.
- [__Reference__](/reference)

    Commands, API endpoints, and the security checklist.
</div>

## What is included

- pnpm workspace with `apps/client`, `apps/server`, and `packages/shared`
- React 19 + Vite 8 + TanStack Router (file-based routes)
- Express 5 with async-aware error handling and Better Auth sessions
- MongoDB through Mongoose, plus Better Auth's MongoDB adapter
- React Email templates, Resend delivery, and Tailwind CSS v4
- Biome formatting and linting, plus Node-based tests

## How to use these docs

Newcomers should read Installation, then choose a page in Build your app. Contributors
can use Code quality as their finishing checklist; operators start with Deployment.
