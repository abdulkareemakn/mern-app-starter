---
title: File uploads
description: Upload directly to a private bucket, confirm file metadata, and request temporary download links.
---

# File uploads

This starter kit uploads files directly to private object storage. Object storage keeps
file bytes in a bucket; MongoDB keeps the file's owner, name, size, and upload status.
Express checks permission and issues a presigned URL, a temporary link that authorizes
one storage operation without exposing the server's storage credentials.

Direct uploads keep file bytes out of the API process. The AWS SDK's S3-compatible
client supports Cloudflare R2 and Backblaze B2 through configuration. Both are
recommended providers. The starter ships backend routes and a cleanup job; it does
not include an upload component, a delete endpoint, or a public serving layer.

!!! warning "A signed URL grants temporary access"

    Anyone holding a presigned URL can use it until it expires. Keep these URLs out of
    logs and public pages. The API checks the session and ownership before issuing a
    download URL, but the bucket does not require that session when the URL is used.
    Upload URLs can also be reused until expiry, including after confirmation.

## Configure storage

Before using the upload routes:

1. Create a private bucket and configure credentials using
   [Development workflow: File storage](/installation/development-workflow/#file-storage).
2. For browser clients, configure bucket CORS as described in that section.
3. Start the API and development proxy from the repository root with `pnpm dev` and
   `pnpm dev:ui` in separate terminals.
4. Sign in through Better Auth. Use the same session cookie for all `/api/uploads`
   requests. See [Authentication](/build/authentication/#use-sessions).

An authenticated, valid create request returns `201` when the metadata record and
signed URL have been created. This does not contact the bucket or prove credentials
work there; the direct PUT and confirmation complete that check.

## Upload and download a file

Use an HTTP client that retains the Better Auth session cookie. In local development,
send API requests to `http://localhost:3000`. The following example uses a file named
`report.pdf`; replace its name, MIME type, and byte count with the file being uploaded.

### 1. Request an upload URL

Read the exact byte count from the file. For `report.pdf` in the current directory,
this command works in PowerShell and macOS/Linux shells:

```sh
node -e "console.log(require('node:fs').statSync('report.pdf').size)"
```

Send `POST /api/uploads` with `Content-Type: application/json`. Replace `12345` below
with that command's output:

```json
{
  "filename": "report.pdf",
  "mimeType": "application/pdf",
  "sizeBytes": 12345
}
```

The response is `201 { fileId, uploadUrl, key }`. Keep `fileId` for the remaining API
requests. The record starts as `pending`. The storage key has the form
`ownerId/uuid.extension`; the extension comes from the validated MIME type, not the
filename. The filename is a display name and cannot be empty or contain control characters.

### 2. Send bytes to the bucket

Send `PUT` to the returned `uploadUrl` within five minutes. Select the file as the
raw binary request body and set `Content-Type` to the exact value from step 1.
The HTTP client must send the exact declared `Content-Length`. Do not send JSON or
multipart form data to the bucket.

In browser integrations, use a File or Blob as the body so the browser supplies the
length. `Content-Length` is a [browser-controlled header](https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_request_header).
Do not forward the
application session cookie or add an authorization header to the bucket request;
the URL contains its authorization. A successful storage response means the bytes
have arrived, but the application record is still pending.

### 3. Confirm the upload

After the PUT succeeds, send `POST /api/uploads/:id/confirm`, replacing `:id` with
`fileId`. Send no body or an empty JSON object. The server reads object metadata
using HEAD and requires the exact recorded size and MIME type.

Success returns `200` with a `FileResponse`: `id`, `key`, `ownerId`, `originalName`,
`mimeType`, `sizeBytes`, `status`, `createdAt`, and `confirmedAt`. IDs are strings,
dates are ISO strings, and `status` is now `confirmed`. Confirming an already
confirmed record returns its existing timestamp. An expired pending record cannot
be confirmed; request a new upload instead.

!!! note "Metadata validation is not content inspection"

    Confirmation checks the stored length and declared MIME type. It does not inspect
    file contents or scan for malware. The shared TypeScript response types describe
    JSON contracts; Zod validates incoming request data at runtime.

### 4. Request a download

Send `GET /api/uploads/:id` with the owner's session and no request body. A confirmed
file returns `200 { downloadUrl }`. Use this URL directly to download the object as
an attachment within five minutes. Request another URL when it expires.

The API returns `Cache-Control: no-store` for upload route responses. Files stay
private in the bucket; there is no public CDN URL.

## Implementation

| File | Responsibility |
| --- | --- |
| `apps/server/src/routes/uploads.ts` | Create, confirm, and download routes with ownership checks |
| `apps/server/src/schemas/uploads.ts` | Metadata, ObjectId, and empty-body validation |
| `apps/server/src/models/file.ts` | File metadata, ownership, status, and timestamps |
| `apps/server/src/lib/storage.ts` | Presigned PUT/GET URLs and bucket HEAD/DELETE operations |
| `apps/server/src/jobs/cleanup-uploads.ts` | Remove expired pending objects and records |
| `packages/shared/src/index.ts` | Browser-safe upload response types |

`app.ts` mounts the feature router behind `authMiddleware(auth)`. Both ID routes
check that the record belongs to the session user. Confirmation rechecks expiry
when updating MongoDB so a slow HEAD cannot confirm a file already eligible for cleanup.

The [API endpoint reference](/reference/api-endpoints/#private-uploads) lists responses
and error codes.

## Verify and troubleshoot

For automated checks, start the dedicated test MongoDB server and export its address
as described in [Development workflow: Upload test database](/installation/development-workflow/#upload-test-database).
Then run from the repository root:

```sh
pnpm test:unit
pnpm --filter @mern/server exec vitest run --root ../.. --config vitest.config.ts tests/integration/uploads.test.ts
```

The tests should pass with a temporary MongoDB database and mocked S3 network calls.
They check signing, validation, authentication, ownership, confirmation, downloads,
and cleanup. They do not verify credentials or CORS on a live provider.

For a provider check, complete the four requests above with a disposable file. The
success condition is a confirmed record followed by a working private download.

| Symptom | Check |
| --- | --- |
| `503` from the API | Storage connection settings are absent; complete configuration and restart the API. |
| `400` from the API | Inspect `details` for an invalid filename, MIME type, byte count, ID, or unexpected body. |
| `401` or `403` from the API | Use a valid session belonging to the file owner. |
| `409` during confirmation | Complete the PUT first; restart expired uploads. Retry if another confirmation changed the record. |
| `422` during confirmation | The stored size or MIME metadata differs from the values in step 1. |
| Bucket signature error | Check expiry, exact content type and length, and that the signed URL is unchanged. |
| Browser CORS error | Check the bucket's allowed origin, methods, and headers; CORS is separate from API authentication. |

## Next step

Schedule [pending-upload cleanup](/build/cron-jobs/#pending-upload-cleanup) so abandoned
uploads do not accumulate.

## References

- [Cloudflare R2 presigned URLs](https://developers.cloudflare.com/r2/api/s3/presigned-urls/)
- [AWS SDK S3 request presigner](https://github.com/aws/aws-sdk-js-v3/tree/main/packages/s3-request-presigner)
- [Backblaze B2 S3-compatible API](https://www.backblaze.com/docs/cloud-storage-s3-compatible-api)
- [MDN browser-controlled request headers](https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_request_header)

Related starter documentation:

- [Storage configuration](/installation/development-workflow/#file-storage)
- [API endpoints](/reference/api-endpoints/#private-uploads)
- [Cron jobs](/build/cron-jobs)
