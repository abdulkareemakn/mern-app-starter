---
title: Development
description: Build the application one connected concern at a time, from identity and data to routes, pages, and email.
---

# Build your app

Build in the same order your users experience the product. Start with the data your feature owns, then decide who can access it. Validate each request before an API route writes data. Add a client page once the server contract is clear.

You do not need every page for every feature. A public read-only page, for example,
may only need a route and database query. Start with the smallest relevant path.

<div class="grid cards" markdown>

- [__Database__](/build/database)

    Add application models with Mongoose.
- [__Authentication__](/build/authentication)

    Configure Better Auth and protect data on the server.
- [__Validation__](/build/validation)

    Check untrusted request data before it reaches the database or another service.
- [__API routes__](/build/api-routes)

    Define a contract, implement an Express handler, and call it from the client.
- [__Client pages__](/build/client-pages)

    Add typed TanStack Router pages and loaders.
- [__Emails__](/build/emails)

    Render React Email templates and send them with Resend.
- [__Middleware__](/build/middleware)

    Reuse authentication and authorization guards.
- [__404 page__](/build/not-found-page)

    Customize the screen shown for an unknown URL.
</div>

## Next step

Start with [Database](/build/database), then follow the widget example through Validation, API routes, and Client pages.

## References

- [Project structure](/installation/project-structure)
- [Development workflow](/installation/development-workflow)
