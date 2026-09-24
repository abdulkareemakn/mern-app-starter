---
title: Cron jobs
description: Run small scheduled jobs with Deno Deploy Cron.
---

# Cron jobs

The starter uses Deno Deploy's native scheduler:

```text
Deno.cron() → job function
```

Cron is useful for scheduled work such as daily reminders, periodic cleanup, reports,
or data synchronization.

## Create a job

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

## Scheduling behavior

- Schedules use five-field cron expressions and UTC. The minimum interval is one minute.
- Failed executions are not retried by default. An optional `backoffSchedule` can add up
  to five retries, with each delay limited to one hour.
- The same job does not overlap itself. If it is still running at the next scheduled
  time, that run is skipped.
- Cron jobs run on every production or Git branch timeline where they are registered.
- Free organizations can register up to 10 cron jobs per revision.

See the official [Deno Deploy Cron documentation](https://docs.deno.com/deploy/reference/cron/)
for schedule examples, retries, timelines, and execution history.
