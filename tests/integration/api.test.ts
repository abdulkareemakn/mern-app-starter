import request from "supertest";
import { describe, expect, test } from "vitest";
import { createApp } from "../../apps/server/src/app.ts";
import type { createAuth } from "../../apps/server/src/auth.ts";
import type { Config } from "../../apps/server/src/config.ts";

const auth = { handler: () => new Response() } as unknown as ReturnType<
  typeof createAuth
>;
const config = {
  nodeEnv: "test",
  port: 3001,
  mongodbUri: "mongodb://unused",
  secret: "unused",
  appUrl: "http://localhost:3000",
  authUrl: "http://localhost:3000",
  resendApiKey: undefined,
  trustProxy: [],
  storage: undefined,
  storageMaxUploadBytes: 25 * 1024 * 1024,
  storageAllowedMimeTypes: ["image/png"],
  storagePendingMaxAgeHours: 24,
} satisfies Config;
const app = createApp(auth, config);

describe("API errors", () => {
  test("returns JSON errors for unknown routes and malformed JSON", async () => {
    expect((await request(app).get("/api/missing")).body).toEqual({
      error: "API route not found",
    });
    const malformed = await request(app)
      .post("/api/missing")
      .set("content-type", "application/json")
      .send("{");
    expect(malformed.status).toBe(400);
    expect(malformed.body).toEqual({ error: "Invalid request body" });
  });
});
