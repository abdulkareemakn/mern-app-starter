import mongoose from "mongoose";
import { connectDatabase, disconnectDatabase } from "../src/database.ts";

export default async function teardown() {
  const uri = process.env.TEST_MONGODB_URI;
  const dbName = process.env.E2E_DB_NAME;
  if (!uri || !dbName) return;
  await connectDatabase(uri, dbName);
  if (mongoose.connection.name === dbName)
    await mongoose.connection.dropDatabase();
  await disconnectDatabase();
}
