import { randomBytes, randomUUID } from "node:crypto";
import mongoose from "mongoose";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { createApp } from "../../apps/server/src/app.ts";
import { createAuth } from "../../apps/server/src/auth.ts";
import { readConfig } from "../../apps/server/src/config.ts";
import {
  connectDatabase,
  disconnectDatabase,
} from "../../apps/server/src/database.ts";

const dbName = `mern_test_${randomUUID().replaceAll("-", "")}`;
let app: ReturnType<typeof createApp>;

beforeAll(async () => {
  try {
    process.loadEnvFile("../../.env");
  } catch {}
  const origin = "http://localhost:3000";
  const config = readConfig({
    ...process.env,
    NODE_ENV: "test",
    APP_URL: origin,
    BETTER_AUTH_URL: origin,
    BETTER_AUTH_SECRET: randomBytes(32).toString("hex"),
  });
  await connectDatabase(config.mongodbUri, dbName);
  app = createApp(createAuth(config), config);
});

afterAll(async () => {
  if (mongoose.connection.name === dbName)
    await mongoose.connection.dropDatabase();
  await disconnectDatabase();
});

describe("authentication API", () => {
  test("signs up, uses and revokes a session", async () => {
    const agent = request.agent(app);
    const credentials = {
      name: "Test student",
      email: `student-${randomUUID()}@example.com`,
      password: randomBytes(24).toString("hex"),
    };

    expect((await request(app).get("/api/me")).status).toBe(401);
    expect(
      (await agent.post("/api/auth/sign-up/email").send(credentials)).status,
    ).toBe(200);
    expect((await agent.get("/api/me")).body.user).toMatchObject({
      name: credentials.name,
      email: credentials.email,
    });
    expect((await agent.post("/api/auth/sign-out").send({})).status).toBe(200);
    expect((await agent.get("/api/me")).status).toBe(401);
  });
});
