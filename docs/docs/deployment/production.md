---
title: Production deployment
description: Deploy the complete React, Express, and MongoDB application to Deno Deploy from GitHub.
---

# Production deployment

The starter kit runs as **one Deno Deploy app**. In production, Express serves the
built React SPA and the `/api` routes from the same HTTPS origin.

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
3. Provision a reachable MongoDB database.

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

After the first build returns the production URL, create a temporary `.env.production` file in the project root:

```dotenv
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
BETTER_AUTH_SECRET=paste-generated-secret
RESEND_API_KEY=paste-resend-key
APP_URL=https://your-app.deno.net
BETTER_AUTH_URL=https://your-app.deno.net
```

Replace the placeholders with your production values and replace `https://your-app.deno.net` with the production URL returned by Deno Deploy. `APP_URL` and `BETTER_AUTH_URL` must be identical.

Generate `BETTER_AUTH_SECRET` locally with the Node.js command in [Development workflow](/installation/development-workflow/#environment-variables). Verify a sending domain with Resend before sending production mail.

Load the variables into Deno Deploy:

```sh
deno deploy env load .env.production
```

Once the command succeeds, **delete `.env.production` immediately**. It contains production credentials and should not be committed or kept in the repository:

```sh
rm .env.production
```

Then restrict the variables to the `production` context:

```sh
deno deploy env update-contexts NODE_ENV production
deno deploy env update-contexts MONGODB_URI production
deno deploy env update-contexts BETTER_AUTH_SECRET production
deno deploy env update-contexts RESEND_API_KEY production
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

## References

- [Deno Deploy CLI](https://docs.deno.com/runtime/reference/cli/deploy/)
- [Resend domain verification](https://resend.com/docs/dashboard/domains/introduction)
