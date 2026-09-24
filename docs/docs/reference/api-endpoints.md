---
title: API endpoints
description: The starter's HTTP surface, including health, the session-protected user route, and Better Auth endpoints.
---

# API endpoints

These are the routes the template ships. Add feature routes to `apps/server/src/app.ts` and keep their request/response contracts documented here.

## Health

`GET /api/health` returns `200 { status: "ok" }` when MongoDB is ready and `503 { status:
"unavailable" }` otherwise. The shared `HealthResponse` type is the client contract.

## Current user

`GET /api/me` requires a session and returns `{ user: { id, name, email } }`. Without a
valid session it returns `401` with the standard `ApiError` body.

## Example user route

`POST /api/example/users` is the shipped validation example. It accepts a JSON body with `name`, `email`, and `age`, returns `201 { user: ... }` on success, and returns `400 { error, details }` for invalid input. It does not write a user to MongoDB or create a Better Auth account.

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

## References

- [Express routing](https://expressjs.com/en/guide/routing.html)
- [API routes](/build/api-routes)
- [Authentication](/build/authentication)
