---
title: MongoDB Atlas
description: Configure the managed MongoDB service used by production deployments.
---

# MongoDB Atlas

Production deployments need a reachable MongoDB database. Deno Deploy does not run the Compose `mongo` service, so the supported managed option is MongoDB Atlas. Docker can use either the local Compose database or Atlas.

1. Create an Atlas project and cluster.
2. Create a database user; this is separate from your Atlas account.
3. Configure Network Access with the deployment's egress IPs or a private endpoint. Avoid `0.0.0.0/0` unless it is a deliberate, temporary development choice.
4. Copy the SRV connection string (`mongodb+srv://...`) and select the application database name.
5. Set `MONGODB_URI` in the deployment's secret/environment settings. Do not commit it.

Use a separate database or cluster for production and integration tests. Enable backups, review monitoring, and rotate credentials. If a deployment cannot reach Atlas, check the Network Access list, user password encoding, and whether the URI contains the intended database name.

See [environment variables](../build/environment-variables.md), [Deno production deployment](production.md), and [Docker](docker.md).
