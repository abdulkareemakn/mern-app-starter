---
title: Cron jobs
description: Run and schedule pending-upload cleanup, with optional Deno Deploy cron guidance.
---

# Cron jobs

This starter kit ships a command that removes abandoned file uploads. A scheduled
job runs such maintenance automatically at a chosen interval. The cleanup command
works independently of the HTTP server, so it can run under a host scheduler without
adding an in-process timer or a scheduling dependency.

No job is registered automatically by `index.ts` or `deploy.ts`. Starting or deploying
the API does not schedule cleanup. Deno Deploy's native cron is an optional integration
described below.

## Pending-upload cleanup

The job finds pending records older than the configured retention period, attempts
to delete each bucket object, then removes its MongoDB record. It ignores missing
objects. Failed deletions leave the record available for another run, while other
eligible files continue to be processed. Confirmed and recent pending files remain.

Before running it, install workspace dependencies, make MongoDB reachable, and complete
the server and [storage configuration](/installation/development-workflow/#file-storage).
The CLI uses the same configuration validation as the API, including production settings.

!!! warning "Cleanup uses the configured bucket and database"

    This command performs deletions; it has no dry-run mode. Verify the selected
    environment before running it. Confirmation rejects expired pending records so
    an upload cannot become confirmed while eligible for cleanup.

### Run once

From the repository root on Windows, macOS, or Linux:

```sh
pnpm --filter @mern/server uploads:cleanup
```

This command loads the root environment file when present, connects to MongoDB, runs
cleanup, and closes the database connection. A successful run exits with code `0`
and reports counts, for example:

```text
Upload cleanup: 3 cleaned, 0 failed
```

Zero cleaned records is also a successful run when none are eligible. A deletion
failure produces a nonzero exit code after the summary. A configuration or connection
failure can occur before the job produces a summary.

### Schedule the production command

Build from the repository root before scheduling:

```sh
pnpm --filter @mern/server build
```

Configure the host scheduler to run the following command hourly, with the repository
root as its working directory and the same injected environment as the API:

```sh
node apps/server/dist/scripts/cleanup-uploads.js
```

The compiled command does not load `.env` automatically. Configure the scheduler's
environment separately; it does not inherit settings from an already running API.
Use the Node.js 24+ executable's absolute path if the scheduler has a different PATH.

=== "Windows Task Scheduler"

    Create a task with a daily trigger that repeats every hour indefinitely. Set
    **Program/script** to the absolute path of `node.exe`, **Add arguments** to
    `apps/server/dist/scripts/cleanup-uploads.js`, and **Start in** to the repository
    root. Run it under the account with the required environment and network access.
    Under **Settings**, choose **Do not start a new instance** when the task is running.

=== "macOS / Linux or a managed scheduler"

    Use an hourly schedule (`0 * * * *` where cron expressions are supported), the
    compiled command above, and the repository root as the working directory.
    Configure the scheduler to prevent overlapping runs and capture stdout, stderr,
    and the exit status. Managed hosts can supply the same secret settings to the job.

Schedule one instance per bucket/database pair. Check the first scheduled run for a
summary and exit code `0`. Investigate failed runs for credential permissions, bucket
retention restrictions, or database connectivity, then rerun after fixing the cause.

For versioned buckets, including B2, configure lifecycle retention for historical
versions and delete markers separately. The job issues `DeleteObject` without a
version ID; that does not guarantee historical bytes are permanently removed.

### Implementation and tests

`apps/server/src/jobs/cleanup-uploads.ts` exports `cleanupUploads(config)` and expects
an existing MongoDB connection. `apps/server/src/scripts/cleanup-uploads.ts` is the
standalone entrypoint that owns configuration, connection setup, and shutdown.
Do not import the CLI entrypoint into the HTTP server; it closes the shared connection.

The [upload integration tests](/build/file-uploads/#verify-and-troubleshoot) verify
expired pending cleanup, confirmed/recent preservation, missing objects, and retries
after failed deletion. Their bucket calls are mocked.

## Optional Deno Deploy cron

Deno Deploy can discover schedules registered with `Deno.cron()`. This integration
is not enabled in the shipped entrypoint. The following example shows an optional
application job, not the existing upload cleanup command.

### Create a job

Keep the job separate from its schedule so it remains ordinary, testable TypeScript:

```ts title="apps/server/src/jobs/example-job.ts"
export async function runExampleJob() {
  console.info("Example cron job completed");
}
```

Import and register it at the top of the Deno Deploy entrypoint:

```ts title="apps/server/src/deploy.ts"
import { runExampleJob } from "#/jobs/example-job";

Deno.cron("example-job", "0 2 * * *", runExampleJob);

await import("./index.ts");
```

`0 2 * * *` runs every day at 02:00 UTC. Keep registrations at module top level and
before the server starts so Deno Deploy can discover them during deployment.

Commit and push the change using the normal [production deployment](/deployment/production)
workflow. The registered job and its runs appear in the app's **Cron** tab.

!!! note "Local development"

    Cron schedules do not run during normal local Node.js development. They run on Deno
    Deploy. The underlying job functions are ordinary TypeScript functions and can be
    tested independently.

### Scheduling behavior

- Schedules use five-field cron expressions and UTC. The minimum interval is one minute.
- Failed executions are not retried by default. An optional `backoffSchedule` can add up
  to five retries, with each delay limited to one hour.
- The same job does not overlap itself. If it is still running at the next scheduled
  time, that run is skipped.
- Cron jobs run on every production or Git branch timeline where they are registered.
- Free organizations can register up to 10 cron jobs per revision.

When adapting upload cleanup to this scheduler, initialize configuration and MongoDB
before the job calls `cleanupUploads(config)`, and preserve the server's connection.
The standalone CLI's connect/disconnect lifecycle is for a separate process.

## Next step

Return to [File uploads](/build/file-uploads) to verify the complete upload and download flow.

## References

- [Deno Deploy cron registration and scheduling](https://docs.deno.com/deploy/reference/cron/)
- [Backblaze B2 S3 Delete Object](https://www.backblaze.com/apidocs/s3-delete-object)

Related starter documentation:

- [Storage configuration](/installation/development-workflow/#file-storage)
- [File uploads](/build/file-uploads)
- [Production deployment](/deployment/production)
