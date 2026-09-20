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
} satisfies Config;
const app = createApp(auth, config);

describe("example API", () => {
  test("accepts a valid user", async () => {
    const response = await request(app)
      .post("/api/example/users")
      .send({ name: " Ada ", email: "ada@example.com", age: 30 });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      user: { name: "Ada", email: "ada@example.com", age: 30 },
    });
  });

  test("returns structured Zod validation errors", async () => {
    const response = await request(app)
      .post("/api/example/users")
      .send({ name: "", email: "nope", age: 12 });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid request body");
    expect(Object.keys(response.body.details.fieldErrors)).toEqual([
      "name",
      "email",
      "age",
    ]);
  });

  test("returns JSON errors for unknown routes and malformed JSON", async () => {
    expect((await request(app).get("/api/missing")).body).toEqual({
      error: "API route not found",
    });
    const malformed = await request(app)
      .post("/api/example/users")
      .set("content-type", "application/json")
      .send("{");
    expect(malformed.status).toBe(400);
    expect(malformed.body).toEqual({ error: "Invalid request body" });
  });
});
