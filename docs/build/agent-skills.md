---
title: Agent skills
description: The project-local guidance agents use when changing the starter.
---

# Agent skills

Skills are instructions for coding agents, not runtime dependencies. They keep common changes consistent while leaving the application code ordinary and inspectable.

Important project skills include:

- `design-md`: asks for a few human design choices, derives the detailed system, writes and lints `DESIGN.md`, and keeps shadcn and CSS aligned.
- `shadcn`: adds, searches, migrates, and composes shadcn components using the repository's Base UI setup.
- `better-interface` and its focused `better-*` skills: review accessibility, color, layout, typography, UI polish, and writing.
- `better-auth-*`: guide authentication configuration and security decisions.
- `varlock`: handles environment variables and secrets without printing them.

Invoke a skill by describing the task naturally, or name it explicitly when precision matters. Read the relevant skill before making a broad change. Agents should inspect existing patterns first and avoid adding a new abstraction when the starter already has one.

The skills do not replace tests, typechecking, or review. They explain the intended workflow; the repository and `DESIGN.md` remain the source of truth.
