import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/app.ts";
import type { createAuth } from "../src/auth.ts";
import type { Config } from "../src/config.ts";

test("validates example user requests", async () => {
  const auth = { handler: () => new Response() } as unknown as ReturnType<
    typeof createAuth
  >;
  const config: Config = {
    nodeEnv: "test",
    port: 3001,
    mongodbUri: "mongodb://unused",
    secret: "unused",
    appUrl: "http://localhost:3000",
    authUrl: "http://localhost:3000",
    trustProxy: [],
  };
  const server = createApp(auth, config).listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  assert(address && typeof address !== "string");
  const url = `http://127.0.0.1:${address.port}/api/example/users`;

  try {
    const invalid = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "", email: "nope", age: 12 }),
    });
    assert.equal(invalid.status, 400);
    assert.deepEqual(Object.keys((await invalid.json()).details.fieldErrors), [
      "name",
      "email",
      "age",
    ]);

    const valid = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: " Ada ",
        email: "ada@example.com",
        age: 30,
      }),
    });
    assert.equal(valid.status, 201);
    assert.deepEqual(await valid.json(), {
      user: { name: "Ada", email: "ada@example.com", age: 30 },
    });
  } finally {
    server.close();
  }
});
