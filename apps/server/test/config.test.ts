import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { test } from "node:test";
import { readConfig } from "../src/config.ts";

test("validates configuration without exposing invalid values", () => {
  const env = {
    MONGODB_URI: "mongodb://127.0.0.1:27017/mern",
    APP_URL: "http://localhost:3000",
    BETTER_AUTH_URL: "http://localhost:3000",
    BETTER_AUTH_SECRET: randomBytes(32).toString("hex"),
  };
  assert.equal(readConfig(env).port, 3001);
  for (const invalid of [
    { PORT: "0" },
    { PORT: "3.5" },
    { PORT: "65536" },
    { NODE_ENV: "invalid" },
    { MONGODB_URI: "https://example.com" },
    { BETTER_AUTH_SECRET: "short" },
    { APP_URL: "not-a-url" },
    { APP_URL: "http://localhost:3000/path" },
    { APP_URL: "http://user:password@localhost:3000" },
    { BETTER_AUTH_URL: "http://localhost:4000" },
  ])
    assert.throws(() => readConfig({ ...env, ...invalid }));
});
