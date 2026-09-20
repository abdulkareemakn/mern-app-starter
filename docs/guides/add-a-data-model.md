---
title: Add a data model
description: Define a Mongoose schema and model under apps/server/src/models/ and use it from a route.
---

# Add a data model

Add a Mongoose model when the application needs to persist its own data. This guide
creates a `Widget` model and uses it from API handlers; authentication data remains
owned by Better Auth.

## 1. Create the model

Create `apps/server/src/models/widget.ts`:

```ts
import mongoose from "mongoose";

const widgetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
  },
  { timestamps: true },
);

export const Widget = mongoose.model("Widget", widgetSchema);
```

Mongoose infers the TypeScript document type from this inline schema definition.
`required`, `trim`, and `maxlength` protect stored data, while `timestamps` adds
`createdAt` and `updatedAt`. The application already opens the Mongoose connection in
`apps/server/src/index.ts`; model files should not call `mongoose.connect()` again.

Mongoose derives the collection name (`widgets`) from the model name. Keep the model
name singular and the file name lowercase.

## 2. Use it in a route

Import the model into `apps/server/src/app.ts`, then add handlers after
`express.json()` and before the `/api` 404 handler:

```ts
import type { ApiError, WidgetListResponse } from "@mern/shared";
import { Widget } from "./models/widget.ts";

app.get("/api/widgets", async (_req, res) => {
  const widgets = await Widget.find().sort({ createdAt: -1 }).lean();
  res.json({
    widgets: widgets.map((widget) => ({
      id: widget._id.toString(),
      name: widget.name,
    })),
  } satisfies WidgetListResponse);
});

app.post("/api/widgets", async (req, res) => {
  if (typeof req.body?.name !== "string" || !req.body.name.trim()) {
    res.status(400).json({ error: "Name is required" } satisfies ApiError);
    return;
  }

  const widget = await Widget.create({ name: req.body.name.trim() });
  res.status(201).json({ id: widget.id, name: widget.name });
});
```

Define `WidgetListResponse` in `packages/shared/src/index.ts` as shown in
[Add an API route](/guides/add-an-api-route). `.lean()` returns plain objects for
the read-only list, avoiding hydrated Mongoose documents when their methods are not
needed. Map `_id` to a string `id` rather than exposing a database document as the API
contract.

The POST handler validates the untrusted request body before using the model. Schema
validation is still useful for writes from other code paths, but database errors flow
to the generic error middleware and should not be exposed raw to clients.

## 3. Keep auth data out

Better Auth manages users, sessions, accounts, and verification records through its
MongoDB adapter. Do not create a competing `User` model or write directly to those
collections. Store application-specific records in separate models and refer to the
authenticated user by the ID supplied by Better Auth when ownership is needed.

## 4. Verify

Start MongoDB and the application, then create and list a widget:

```sh
pnpm db:up
pnpm dev
curl -i -X POST http://mern.localhost/api/widgets \
  -H 'content-type: application/json' \
  -d '{"name":"First widget"}'
curl -i http://mern.localhost/api/widgets
pnpm typecheck
```

The POST should return `201`; the following GET should include the new widget with a
string `id`. Also send an empty name and confirm it returns `400` without inserting a
document. Run `pnpm test:integration` once the model is covered by the integration
suite.
