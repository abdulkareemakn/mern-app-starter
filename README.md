# MERN course starter

A pnpm workspace with React, Vite, TanStack Router, Express 5, TypeScript, Mongoose, and Better Auth. The frontend includes shadcn/ui with Base UI and Tailwind CSS; Biome handles formatting and linting from the root.

## Start developing

Install Node.js 24+ (24 LTS recommended), pnpm 11.3.0, and Docker with Compose.

```sh
pnpm install
cp .env.example .env
openssl rand -base64 32
```

Paste the generated value into `BETTER_AUTH_SECRET` in the root `.env`. Keep this file private. Then:

```sh
pnpm db:up
pnpm dev
pnpm dev:ui
```

Open **http://localhost:3000**. Create an account, then use **Test protected API** to verify the complete flow. `pnpm dev` runs the API and local mail catcher; `pnpm dev:ui` runs Vite in its own interactive terminal. Vite proxies `/api` to Express on port 3001 so cookies remain on one browser origin.

Local email is captured automatically by MailDev. Open **http://localhost:3003** to inspect messages; application code sends through `sendEmail` from `apps/server/src/lib/email-client.ts`. Development uses local SMTP on port 3025, while production uses Resend and requires `RESEND_API_KEY`. Run `pnpm dev:mail` separately when authoring templates, then open **http://localhost:3002**.

Already have MongoDB or Atlas? Set `MONGODB_URI` and skip `pnpm db:up`. The app connects before accepting requests and exits if startup fails.

Node 24 loads the root `.env` at the server startup boundary. `readConfig(process.env)` then uses Zod to validate and transform raw strings into typed configuration; invalid settings name the affected variable and stop startup. Application modules receive that validated config instead of reading `process.env`. Production does not require an environment file: a host or container can inject the same variables directly.

## Layout

```text
apps/
  client/src/
    routes/           # TanStack Router file routes
    pages/404.tsx     # 404 page for URLs that match no route
    lib/auth-client.ts
  server/src/
    index.ts          # Startup, database connection, graceful shutdown
    config.ts         # Environment validation
    auth.ts           # Better Auth + MongoDB adapter
    app.ts            # Express middleware and API routes
    middleware/auth.ts # Reusable session guard
packages/shared/src/
  index.ts            # Browser-safe API response types
```

Add Express routes in `app.ts`; extract a feature router when a feature grows. Add Mongoose schemas/models under `apps/server/src/models/` when your project needs application data. Better Auth manages its own users, accounts, sessions, and verification collections through the MongoDB adapter, using Mongoose's existing connection. Don't create a competing Mongoose user schema for authentication.

Mongoose runs **only on the server**. Import shared contracts with `import type { ... } from "@mern/shared"`. They describe JSON responses, not database documents, and don't replace runtime validation of incoming request bodies. The shared package needs no build because its exports contain types only.

The starter endpoints are `GET /api/health`, `GET /api/me` (requires a session), and Better Auth's `/api/auth/*` routes. Keep the auth handler before `express.json()`. Express 5 forwards rejected async route handlers to the error middleware automatically. Protect every private endpoint on the server even if the UI also hides it.

Use `authMiddleware(auth)` before a private route's handler. It returns `401` when no session exists and exposes the validated session as `res.locals.session`. Add future route-specific middleware beside `middleware/auth.ts` and place it after `authMiddleware` when it needs the authenticated user.

## Validate API requests

Put each Zod schema in `apps/server/src/schemas/`; it remains the single source of truth for both validation and types.

```ts
import * as z from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Enter a valid email address"),
});
export type CreateUser = z.infer<typeof createUserSchema>;
```

Use `validate` from `apps/server/src/middleware/validate.ts` on the route. Parsed values, including defaults and transforms, are available in `res.locals.validated`:

```ts
app.post(
  "/api/users",
  validate({ body: createUserSchema }),
  (_req, res) => res.status(201).json({ user: res.locals.validated.body }),
);

app.get(
  "/api/users/:id",
  validate({ params: userParamsSchema, query: paginationSchema }),
  (_req, res) => res.json(res.locals.validated),
);
```

The middleware returns `400` with `{ error, details }` on failure. Express infers inline route handlers from the schema; for an extracted handler, use `ValidatedLocals<typeof schemas>` from the same module rather than duplicating a request type.

## Commands

Run these at the repository root:

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the API and MailDev inbox/SMTP server |
| `pnpm dev:ui` | Start the interactive Vite client on port 3000 |
| `pnpm dev:mail` | Start the React Email preview on port 3002 |
| `pnpm build` | Build the client and compile the server |
| `pnpm typecheck` | Generate route types and check all packages |
| `pnpm ui add <component>` | Add a shadcn Base UI component to the client |
| `pnpm check` | Check formatting and lint rules |
| `pnpm format` | Apply formatting and safe lint fixes |
| `pnpm test` | Run unit and API integration tests |
| `pnpm test:unit` | Run fast Vitest unit tests |
| `pnpm test:integration` | Run Vitest + Supertest API tests |
| `pnpm test:e2e` | Run the Playwright user workflow in Chromium |
| `pnpm test:e2e:ui` | Open Playwright's interactive UI |
| `pnpm db:up` / `pnpm db:down` | Start/stop local MongoDB |
| `pnpm docker:up` / `pnpm docker:down` | Build/start or stop the complete stack |
| `pnpm start` | Run the compiled server |

## Testing

See [TESTING.md](TESTING.md) for the full testing guide, including test-layer boundaries, local setup, CI behavior, and troubleshooting.

Tests are split by cost and purpose:

- **Unit** (`tests/unit/`) uses Vitest for isolated configuration and Zod schema behavior.
- **API integration** (`tests/integration/`) uses Vitest and Supertest to send requests through Express, middleware, Better Auth, and MongoDB without starting an HTTP listener.
- **E2E** (`tests/e2e/`) uses Playwright to drive the real React → Express → MongoDB sign-up, protected API, and sign-out workflow, plus the 404 page served for unknown client URLs.

Start the local MongoDB container with `pnpm db:up`, then set `TEST_MONGODB_URI=mongodb://127.0.0.1:27017` in `.env` before running integration or E2E tests. Test mode requires this variable and never falls back to `MONGODB_URI`. Each persistence test run creates and deletes a randomly named `mern_test_*` or `mern_e2e_*` database; the configured MongoDB user therefore needs permission to create and drop databases.

Install Playwright's supported browser once with `pnpm exec playwright install chromium`. Use unit tests for pure logic, API integration tests when backend pieces must work together, and Playwright only for complete user workflows. Run the cheapest relevant layer while iterating and broader suites before finishing significant changes.

For a production build outside Docker, run `pnpm build`, set `NODE_ENV=production`, `MONGODB_URI`, both public URLs, `BETTER_AUTH_SECRET`, and `RESEND_API_KEY` in `.env` or the host environment, then `pnpm start`. Express serves the client build in production, including SPA route fallback. Your public URL must point to Express (port 3001 by default) or a reverse proxy in front of it.

## Frontend components

The auth page uses the included shadcn Button, Input, Label, and Card components. Run `pnpm ui add dialog` from the root to add another component; `pnpm ui info` shows the active Base UI configuration. This template is already initialized.

## Establish your design system

Ask your agent: **“Use design-md to establish the design system for my [application]. It should feel [a few words]. Recommend the details.”** The project-local [design-md skill](.agents/skills/design-md/SKILL.md) guides the process. You can supply colors (including a Coolors palette), fonts, references, or a [shadcn preset](https://ui.shadcn.com/create).

You choose the product's character and any preferences about color, typography, density, rounding and icons. “Recommend for me” is enough for anything you don't care about. The agent derives readable color roles, type sizes, spacing, component states and accessibility rules, then records them in a root **DESIGN.md** and implements the supported choices through shadcn and the existing CSS. Nova, Neutral and Lucide are starter defaults, not permanent requirements; Base UI remains the component foundation. An established app can be documented, evolved or replaced; a fresh starter doesn't need a visual audit.

DESIGN.md is the source of truth for future interface work. To change it, ask **“Use design-md to make our design system [warmer/more compact/etc.] and keep the implementation aligned.”** The agent updates the document and implementation together and preserves customized components. Avoid applying a full preset casually: it can overwrite component code and theme values. You do not need to scaffold another app.

After establishing the system:

```sh
pnpm design:lint                    # Official Google DESIGN.md validation
pnpm ui add @shadcn/dialog          # Add components using your active configuration
```

Ask the agent to follow DESIGN.md when using new components and reconcile any generated theme changes. Validation checks tokens and declared contrast pairs; contrast warnings must be reviewed even when the command succeeds. The starter intentionally has no product DESIGN.md until you choose a direction.

Use the configured shadcn icon library for interface controls. For actual brand/social identities, add `react-icons` when first needed (`pnpm --filter @mern/client add react-icons`) and use named Simple Icons imports such as `import { SiGithub } from "react-icons/si"`. Check that the requested brand exists; otherwise use its official SVG. Don't mix additional general-purpose icon sets. Brand icons beside text are decorative; icon-only controls need accessible labels.

## Two Docker workflows

**Local development:** `compose.db.yaml` runs MongoDB with a named volume, exposing port 27017 only on the host's loopback address. Node and Vite run on your computer.

**Complete deployment example:** `compose.yaml` builds both apps into one image. Express serves the built SPA and API; MongoDB has a persistent volume and no published port. The runtime container runs as a non-root user. Start it with:

```sh
pnpm docker:up
```

Open http://localhost:3000. Stop `pnpm dev:ui` first so port 3000 is available. The local-development and full-stack databases use separate volumes and do not share accounts. `down` preserves data; adding `--volumes` deletes the corresponding stack's database permanently.

For a cloud VM with Docker, configure `APP_URL` and `BETTER_AUTH_URL` to the same public HTTPS origin, set a unique `BETTER_AUTH_SECRET`, and place the app behind your provider's HTTPS ingress/reverse proxy. `APP_PORT` selects the published host port; it does not change the public URL automatically. Keep MongoDB private, arrange backups of its volume, and inject secrets through your deployment platform. This Compose file is a single-host reference; it does not provision DNS, TLS, backups, or a managed database.

The default MongoDB container is standalone. The auth adapter therefore runs without multi-document transactions. If your project needs transactions, deploy a replica set (or Atlas) and configure the adapter with the MongoDB client. Email/password authentication is enabled, but email verification and password-reset email delivery need your own mail provider before you enable them. Auth rate limiting is enabled with database storage.

Behind an HTTPS ingress, set `TRUST_PROXY` to the exact IPs/CIDRs of your trusted proxy, and configure that proxy to overwrite forwarded client-IP headers. Leave it empty for direct connections. Express resolves the client address and passes it to Better Auth through a header that the server always overwrites; browser-supplied IP headers cannot bypass rate limiting. Without proxy configuration, users behind the same ingress share its rate-limit bucket.

## Environment and template maintenance

The root `.env.example` documents all settings. Node loads the root `.env` for server commands; Vite reads it for the development proxy. Only variables prefixed `VITE_` can be exposed to browser code—never use that prefix for secrets or database URLs. The Docker build excludes environment files.

Commit the root `pnpm-lock.yaml` and generated `apps/client/src/routeTree.gen.ts`. Route generation is automatic during development/build and available through `pnpm --filter @mern/client generate-routes`. Don't hand-edit the generated tree.

Publish this folder as a GitHub repository and enable **Settings → General → Template repository**. Students can choose **Use this template** to create their own repository. Choose a license before distributing the template; none is assumed here.

Implementation references: [Better Auth Express integration](https://www.better-auth.com/docs/integrations/express), [MongoDB adapter](https://www.better-auth.com/docs/adapters/mongo), [Express error handling](https://expressjs.com/en/guide/error-handling/), [Mongoose connections](https://mongoosejs.com/docs/connections.html), and [pnpm Docker guide](https://pnpm.io/docker).
