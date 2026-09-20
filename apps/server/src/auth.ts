import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import mongoose from "mongoose";
import type { Config } from "./config.ts";

export function createAuth(config: Config) {
  const db = mongoose.connection.db;
  if (!db)
    throw new Error("Connect to MongoDB before initializing authentication");
  return betterAuth({
    appName: "MERN starter",
    baseURL: config.authUrl,
    secret: config.secret,
    trustedOrigins: [config.appUrl],
    advanced: { ipAddress: { ipAddressHeaders: ["x-mern-client-ip"] } },
    // ponytail: standalone MongoDB has no transactions; use a replica set and pass client when atomic multi-document writes are needed.
    database: mongodbAdapter(db),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
    },
    rateLimit: { enabled: true, storage: "database" },
    plugins: [admin()],
  });
}
