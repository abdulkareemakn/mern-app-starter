import assert from "node:assert/strict";
import { once } from "node:events";
import { test } from "node:test";
import express from "express";
import { adminMiddleware } from "../src/middleware/admin.ts";

test("admin middleware requires the Better Auth admin role", async (t) => {
  const app = express();
  app.get(
    "/admin",
    (req, res, next) => {
      res.locals.session = { user: { role: req.get("x-role") } };
      next();
    },
    adminMiddleware,
    (_req, res) => res.sendStatus(204),
  );
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(
    () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  );
  const address = server.address();
  assert(address && typeof address !== "string");
  const request = (role: string) =>
    fetch(`http://127.0.0.1:${address.port}/admin`, {
      headers: { "x-role": role },
    });

  assert.equal((await request("user")).status, 403);
  assert.equal((await request("user,admin")).status, 204);
});
