---
title: API endpoints
description: The starter's HTTP surface, including health, the session-protected user route, and Better Auth endpoints.
---

# API endpoints

These are the routes the template ships. Add feature routes alongside the existing
server route modules and keep their request/response contracts documented here.

## Health

`GET /api/health` returns `200 { status: "ok" }` when MongoDB is ready and `503 { status:
"unavailable" }` otherwise. The shared `HealthResponse` type is the client contract.

## Current user

`GET /api/me` requires a session and returns `{ user: { id, name, email } }`. Without a
valid session it returns `401` with the standard `ApiError` body.

## Authentication routes

Better Auth handles everything under `/api/auth/*`. Its handler is mounted before
`express.json()` because it needs the untouched request body.

## Unknown API paths

An unmatched `/api` path returns `404` with an `ApiError` body; it does not fall through
to the SPA fallback.

## Errors

The error middleware returns `413` for oversized bodies, `400` for malformed JSON, and
`500` for unexpected failures. Internal logs omit request bodies, cookies, and database
URLs.
