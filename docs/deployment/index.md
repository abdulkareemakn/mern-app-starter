---
title: Deployment
description: Deploy the complete React, Express, and MongoDB application to Deno Deploy from GitHub.
---

# Deployment

Deploy this template as **one Deno Deploy app**. In production, Express serves the
built React SPA and the `/api` routes from the same HTTPS origin, so Better Auth
sessions work without cross-origin cookie configuration.

The repository includes `deno.json`, which tells Deno Deploy to install the locked
pnpm workspace, build the client and server, and start the compiled Express server. Do
not create a second static-site app for `apps/client`: Express already serves
`apps/client/dist` after the build.

## Before you deploy

1. Create a Deno Deploy account and organization at
   [console.deno.com](https://console.deno.com). Deno Deploy needs an organization
   before it can create an app.
2. Use **GitHub → Use this template** to make your own copy of
   [the starter repository](https://github.com/abdulkareemakn/mern-app-starter), then
   clone and push that copy. Deno Deploy builds from that GitHub repository; it does
   not deploy an unpushed local change.
3. Provision a reachable MongoDB database, such as MongoDB Atlas. Deno Deploy does
   not run the `compose.db.yaml` MongoDB container.

If the repository is not listed during setup, authorize the Deno Deploy GitHub app for
your GitHub account or repository from the prompt. See
[Deno's GitHub integration guidance](https://docs.deno.com/deploy/reference/apps/#github-integration).

## Create the app

From the repository root, run the one command:

```sh
deno deploy create
```

The authenticated CLI opens its setup wizard. Choose your Deno organization, give the
app a unique name, select **GitHub** as the source, then select your copied repository.
Keep the application directory at the repository root and accept the configuration in
`deno.json`.

The app name becomes its default `*.deno.net` URL. You can rename it later in Deno
Deploy's app settings. The CLI does not currently accept an app description; add or
edit that in the same app settings screen after the first deployment.

!!! note "Why the wizard is the pasteable command"

    Your organization, GitHub owner, repository, and unique app name are personal values.
    The wizard collects them while still creating a GitHub-backed app, so every later push
    automatically builds and deploys it.


## Set environment variables

After the first build returns the production URL, replace `https://your-app.deno.net`
below with that exact URL. `APP_URL` and `BETTER_AUTH_URL` must be identical.

```sh
deno deploy env add NODE_ENV production
deno deploy env add MONGODB_URI "mongodb+srv://..." --secret
deno deploy env add BETTER_AUTH_SECRET "$(openssl rand -base64 32)" --secret
deno deploy env add APP_URL "https://your-app.deno.net"
deno deploy env add BETTER_AUTH_URL "https://your-app.deno.net"
```

`MONGODB_URI` and `BETTER_AUTH_SECRET` are secrets; do not commit them or put them in
the client. Leave `TRUST_PROXY` unset on Deno Deploy unless Deno support gives you
specific trusted proxy addresses—guessing it weakens rate-limit client identification.

Use each variable in the `production` context:

```sh
deno deploy env update-contexts NODE_ENV production
deno deploy env update-contexts MONGODB_URI production
deno deploy env update-contexts BETTER_AUTH_SECRET production
deno deploy env update-contexts APP_URL production
deno deploy env update-contexts BETTER_AUTH_URL production
```

The CLI saves the app selected during creation. If you open another checkout or shell,
select it before managing variables: `deno deploy switch --org your-org --app your-app`.

## Verify and keep deploying

Open `https://your-app.deno.net/api/health`. It returns `{ "status": "ok" }` only
after the server connects to MongoDB. Then create an account and test a protected route.

Every push to the linked GitHub repository automatically creates a new build; the Deno
Deploy dashboard shows its build logs and preview URL. Stream runtime logs when needed:

```sh
deno deploy logs
```

Use the dashboard to add a custom domain, then update both public URL variables to that
domain and redeploy. Deno documents the GitHub-triggered build flow in its
[Applications reference](https://docs.deno.com/deploy/reference/apps/) and the build
configuration in its [Builds reference](https://docs.deno.com/deploy/reference/builds/).
