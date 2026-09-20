import { randomBytes } from "node:crypto";
import mongoose from "mongoose";
import { createApp } from "../../apps/server/src/app.ts";
import { createAuth } from "../../apps/server/src/auth.ts";
import { readConfig } from "../../apps/server/src/config.ts";
import {
  connectDatabase,
  disconnectDatabase,
} from "../../apps/server/src/database.ts";

try {
  process.loadEnvFile(".env");
} catch {}

const dbName = process.env.E2E_DB_NAME;
if (!dbName) throw new Error("Playwright did not provide E2E_DB_NAME");
const origin = "http://localhost:4173";
const config = readConfig({
  ...process.env,
  NODE_ENV: "test",
  PORT: "3001",
  APP_URL: origin,
  BETTER_AUTH_URL: origin,
  BETTER_AUTH_SECRET: randomBytes(32).toString("hex"),
});

await connectDatabase(config.mongodbUri, dbName);
const server = createApp(createAuth(config), config).listen(
  config.port,
  "127.0.0.1",
);

let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  await new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
  if (mongoose.connection.name === dbName)
    await mongoose.connection.dropDatabase();
  await disconnectDatabase();
  process.exit(0);
}

process.on("SIGINT", () => void stop());
process.on("SIGTERM", () => void stop());
