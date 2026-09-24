import { readConfig } from "#/config";
import { connectDatabase, disconnectDatabase } from "#/database";
import { cleanupUploads } from "#/jobs/cleanup-uploads";

try {
  const config = readConfig(process.env);
  if (!config.storage) throw new Error("File storage is not configured");
  await connectDatabase(config.mongodbUri);
  await cleanupUploads(config);
} catch {
  console.error(
    "Upload cleanup failed. Check storage configuration and database connectivity.",
  );
  process.exitCode = 1;
} finally {
  await disconnectDatabase();
}
