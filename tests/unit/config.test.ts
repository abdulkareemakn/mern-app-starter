import { randomBytes } from "node:crypto";
import { describe, expect, test } from "vitest";
import { readConfig } from "../../apps/server/src/config.ts";

const validEnv = {
  MONGODB_URI: "mongodb://127.0.0.1:27017/mern",
  APP_URL: "http://localhost:3000",
  BETTER_AUTH_URL: "http://localhost:3000",
  BETTER_AUTH_SECRET: randomBytes(32).toString("hex"),
};

describe("readConfig", () => {
  test("parses defaults and transforms raw strings", () => {
    expect(readConfig(validEnv)).toMatchObject({
      nodeEnv: "development",
      port: 3001,
      mongodbUri: validEnv.MONGODB_URI,
      trustProxy: [],
    });
    expect(
      readConfig({
        ...validEnv,
        PORT: "4321",
        TRUST_PROXY: " loopback, 10.0.0.1 ",
      }),
    ).toMatchObject({ port: 4321, trustProxy: ["loopback", "10.0.0.1"] });
  });

  test.each([
    ["invalid port", { PORT: "0" }],
    ["non-numeric port", { PORT: "nope" }],
    ["invalid environment", { NODE_ENV: "staging" }],
    ["invalid MongoDB URL", { MONGODB_URI: "https://example.com" }],
    ["short auth secret", { BETTER_AUTH_SECRET: "short" }],
    ["malformed URL", { APP_URL: "not-a-url" }],
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

  test("uses TEST_MONGODB_URI instead of MONGODB_URI in tests", () => {
    const testUri = "mongodb://127.0.0.1:27017/tests";
    expect(
      readConfig({
        ...validEnv,
        NODE_ENV: "test",
        TEST_MONGODB_URI: testUri,
      }).mongodbUri,
    ).toBe(testUri);
  });

  test("requires the production email credential", () => {
    expect(() => readConfig({ ...validEnv, NODE_ENV: "production" })).toThrow(
      "RESEND_API_KEY",
    );
  });
});
