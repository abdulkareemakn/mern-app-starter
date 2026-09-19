import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import { once } from "node:events";
import { test } from "node:test";
import mongoose from "mongoose";
import { createApp } from "../src/app.ts";
import { createAuth } from "../src/auth.ts";
import { readConfig } from "../src/config.ts";

test("authentication persists sessions and protects API routes", async (t) => {
  // A unique database prevents the check from modifying application data.
  const dbName = `mern_test_${randomUUID().replaceAll("-", "")}`;
  await mongoose.connect(
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mern",
    {
      dbName,
      serverSelectionTimeoutMS: 5000,
    },
  );
  t.after(async () => {
    assert.equal(mongoose.connection.name, dbName);
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });
  const origin = "http://localhost:3000";
  const config = readConfig({
    NODE_ENV: "test",
    MONGODB_URI: "mongodb://127.0.0.1:27017/unused",
    APP_URL: origin,
    BETTER_AUTH_URL: origin,
    BETTER_AUTH_SECRET: randomBytes(32).toString("hex"),
  });
  const server = createApp(createAuth(config), config).listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(
    () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  );
  const address = server.address();
  assert(address && typeof address !== "string");
  const base = `http://127.0.0.1:${address.port}`;
  const get = (path: string, cookie = "") =>
    fetch(`${base}${path}`, { headers: { cookie } });
  const post = (
    path: string,
    body: unknown,
    cookie = "",
    requestOrigin = origin,
  ) =>
    fetch(`${base}${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: requestOrigin,
        cookie,
        "x-mern-client-ip": "203.0.113.99",
        "x-forwarded-for": "203.0.113.99",
      },
      body: JSON.stringify(body),
    });
  assert.equal((await get("/api/health")).status, 200);
  assert.equal((await get("/api/me")).status, 401);
  assert.equal((await get("/api/missing")).status, 404);
  for (const [body, status] of [
    ["{", 400],
    [JSON.stringify({ text: "x".repeat(110_000) }), 413],
  ] as const) {
    const response = await fetch(`${base}/api/me`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    });
    assert.equal(response.status, status);
  }
  const credentials = {
    name: "Test student",
    email: "student@example.com",
    password: randomBytes(24).toString("hex"),
  };
  const signup = await post("/api/auth/sign-up/email", credentials);
  assert.equal(signup.status, 200);
  const storedSession = await mongoose.connection
    .collection("session")
    .findOne({});
  assert.equal(storedSession?.ipAddress, "127.0.0.1");
  const cookie = signup.headers
    .getSetCookie()
    .map((value) => value.split(";")[0])
    .join("; ");
  assert(cookie);
  const me = await get("/api/me", cookie);
  assert.equal(me.status, 200);
  assert.equal((await me.json()).user.email, credentials.email);
  assert.equal(
    (await post("/api/auth/sign-out", {}, cookie, "https://untrusted.example"))
      .status,
    403,
  );
  assert.equal((await post("/api/auth/sign-out", {}, cookie)).status, 200);
  assert.equal((await get("/api/me", cookie)).status, 401);
  assert.equal(
    (
      await post("/api/auth/sign-in/email", {
        ...credentials,
        password: "wrong-password",
      })
    ).status,
    401,
  );
  const signin = await post("/api/auth/sign-in/email", credentials);
  assert.equal(signin.status, 200);
  const signedInCookie = signin.headers
    .getSetCookie()
    .map((value) => value.split(";")[0])
    .join("; ");
  assert.equal((await get("/api/me", signedInCookie)).status, 200);
});
