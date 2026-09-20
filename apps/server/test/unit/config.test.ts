import { randomBytes } from "node:crypto";
import { describe, expect, test } from "vitest";
import { readConfig } from "../../src/config.ts";

const validEnv = {
  MONGODB_URI: "mongodb://127.0.0.1:27017/mern",
  APP_URL: "http://localhost:3000",
  BETTER_AUTH_URL: "http://localhost:3000",
  BETTER_AUTH_SECRET: randomBytes(32).toString("hex"),
};

describe("readConfig", () => {
  test("returns validated defaults", () => {
    expect(readConfig(validEnv)).toMatchObject({
      nodeEnv: "development",
      port: 3001,
      mongodbUri: validEnv.MONGODB_URI,
      trustProxy: [],
    });
  });

  test.each([
    ["invalid port", { PORT: "0" }],
    ["invalid environment", { NODE_ENV: "staging" }],
    ["invalid MongoDB URL", { MONGODB_URI: "https://example.com" }],
    ["short auth secret", { BETTER_AUTH_SECRET: "short" }],
    ["URL with a path", { APP_URL: "http://localhost:3000/path" }],
    ["different public URLs", { BETTER_AUTH_URL: "http://localhost:4000" }],
  ])("rejects %s", (_name, invalid) => {
    expect(() => readConfig({ ...validEnv, ...invalid })).toThrow();
  });

  test("requires the dedicated MongoDB setting in tests", () => {
    expect(() => readConfig({ ...validEnv, NODE_ENV: "test" })).toThrow(
      "TEST_MONGODB_URI",
    );
  });
});
