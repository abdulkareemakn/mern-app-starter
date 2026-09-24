---
title: Database
description: Connect to MongoDB, create Mongoose models, and use them safely from validated API routes.
---

# Database with MongoDB and Mongoose

The starter kit stores the application data in MongoDB.

[Mongoose](https://mongoosejs.com/) is an ODM (Object Document Mapper) that makes MongoDB documents easier to describe and query from TypeScript. It is chosen here for its mature MongoDB model API and schema
constraints.

!!! note "Validation and database constraints solve different problems"

    Zod is used for input validation at the application level while Mongoose protects write access at the database
    level. It's a good habit to adopt both.


## Project structure

```text
apps/server/src/
  database.ts              # Connect and disconnect helpers
  index.ts                 # Opens one connection before listening
  models/
    widget.ts              # Application model
```

## Configure MongoDB

Set the application connection URL in the root `.env`:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/mern
```

For a hosted environment, use a managed URI such as MongoDB Atlas (`mongodb+srv://...`).
Configure database users, network access, backups, and production separation for the
managed service you choose.

Start MongoDB locally:

=== "Windows"

    The Community Server installer runs it as the `MongoDB` service.

=== "macOS / Linux"

    ```sh
    pnpm db:up
    ```

The server connects before accepting requests. Startup fails if MongoDB is unavailable, and graceful shutdown closes the connection.

## Development Workflow

### Create a model

Create `apps/server/src/models/widget.ts`:

```ts title="apps/server/src/models/widget.ts"
import mongoose from "mongoose";

const widgetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
  },
  { timestamps: true },
);

export const Widget = mongoose.model("Widget", widgetSchema);
```

Mongoose infers the document type from the schema. The singular model name becomes the `widgets` collection.

Schema constraints protect every write path, but they do not replace request validation. Validate at the HTTP boundary so invalid input receives a useful `400` response before it reaches MongoDB.

### Write from a validated route

```ts title="apps/server/src/app.ts"
app.post(
  "/api/widgets",
  validate({ body: createWidgetSchema }),
  async (_req, res) => {
    const widget = await Widget.create(res.locals.validated.body);

    res.status(201).json({
      widget: { id: widget.id, name: widget.name },
    } satisfies WidgetResponse);
  },
);
```

### Read plain objects

Use `.lean()` when a read-only response does not need Mongoose document methods:

```ts
app.get("/api/widgets", async (_req, res) => {
  const widgets = await Widget.find().sort({ createdAt: -1 }).lean();

  res.json({
    widgets: widgets.map((widget) => ({
      id: widget._id.toString(),
      name: widget.name,
    })),
  } satisfies WidgetListResponse);
});
```

Map database fields to an explicit API response instead of returning MongoDB documents directly. This keeps `_id`, internal fields, and future schema changes out of the public contract.

## Ownership and integrity

### Relate records to authenticated users

When records need ownership, add an indexed `ownerId` field to the model and store Better Auth's user ID on each record:

```ts
const ownerId = res.locals.session.user.id;
const widgets = await Widget.find({ ownerId }).lean();
```

Do not create a second user model for authentication or write directly to Better Auth collections. Add a separate profile model only when the application needs data that does not belong in authentication records.

### Indexes and uniqueness

Add indexes for real query and uniqueness requirements:

```ts
widgetSchema.index({ ownerId: 1, name: 1 }, { unique: true });
```

A unique index is the final protection against concurrent duplicate writes. Handle duplicate-key errors as an expected conflict instead of exposing the raw database error.

## Test databases

Integration and E2E tests use `TEST_MONGODB_URI`, then create a random `mern_test_*` or `mern_e2e_*` database. They never fall back to the application database.

```bash
TEST_MONGODB_URI=mongodb://127.0.0.1:27017
```

The configured MongoDB user must be allowed to create and drop those temporary databases.

## Verify

```sh
pnpm test:integration
pnpm typecheck
```

## Next step

Continue to [Authentication](/build/authentication) if records need an owner, then define the widget input in [Validation](/build/validation).

## References

- [Mongoose schemas](https://mongoosejs.com/docs/guide.html)
- [Mongoose connections](https://mongoosejs.com/docs/connections.html)
- [Mongoose queries](https://mongoosejs.com/docs/queries.html)
- [API routes](/build/api-routes)
- [Validation](/build/validation)
- [Authentication](/build/authentication)
