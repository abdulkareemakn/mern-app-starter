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

## Private uploads

This starter kit uploads file bytes directly to a private S3-compatible bucket. All three
upload routes require a Better Auth session and configured storage:

| Route | Successful response |
| --- | --- |
| `POST /api/uploads` with `{ filename, mimeType, sizeBytes }` | `201 { fileId, uploadUrl, key }` |
| `POST /api/uploads/:id/confirm` with no body or `{}` | `200` with the shared `FileResponse` |
| `GET /api/uploads/:id` with no body | `200 { downloadUrl }` |

PUT URLs require the exact declared content type and byte length. PUT and GET URLs expire
after five minutes. Confirmation checks stored size and MIME metadata. Pending files cannot
be downloaded. Both ID routes enforce ownership and validate the MongoDB ID before lookup.

The upload API uses the existing `{ error }` and validation `{ error, details }` formats:
`400` for invalid input, `401` without a session, `403` for another owner, `404` for a missing
record, `409` for an unfinished or expired upload, `422` for mismatched object metadata,
and `503` when storage is disabled. Unexpected provider errors return `500`.

`GET /api/openapi.json` serves the OpenAPI 3.1 upload contract for use with Scalar or another
OpenAPI viewer. Its source is `apps/server/src/openapi.json`. Follow
[File uploads](/build/file-uploads) for the complete request sequence,
[Development workflow](/installation/development-workflow/#file-storage) for storage
configuration, and [Cron jobs](/build/cron-jobs/#pending-upload-cleanup) for cleanup.

## Unknown API paths

An unmatched `/api` path returns `404` with an `ApiError` body; it does not fall through
to the SPA fallback.

## Errors

The error middleware returns `413` for oversized bodies, `400` for malformed JSON, and
`500` for unexpected failures. Internal logs omit request bodies, cookies, and database
URLs.

## References

- [Express routing](https://expressjs.com/en/guide/routing.html)

Related starter documentation:

- [File uploads](/build/file-uploads)
- [API routes](/build/api-routes)
- [Authentication](/build/authentication)
