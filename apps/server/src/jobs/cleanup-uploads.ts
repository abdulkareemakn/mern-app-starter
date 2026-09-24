import type { Config } from "#/config";
import { createStorage } from "#/lib/storage";
import { File } from "#/models/file";

export async function cleanupUploads(config: Config) {
  if (!config.storage) throw new Error("File storage is not configured");
  const storage = createStorage(config.storage);
  const expired = {
    status: "pending" as const,
    createdAt: {
      $lt: new Date(Date.now() - config.storagePendingMaxAgeHours * 3_600_000),
    },
  };
  let cleaned = 0;
  let failed = 0;
  try {
    for await (const file of File.find(expired).cursor()) {
      try {
        await storage.deleteObject(file.key);
        const result = await File.deleteOne({ _id: file._id, ...expired });
        cleaned += result.deletedCount;
      } catch {
        // Keep the document so a later run can retry failed bucket/database deletions.
        failed++;
      }
    }
  } finally {
    storage.destroy();
    console.info(`Upload cleanup: ${cleaned} cleaned, ${failed} failed`);
  }
  if (failed) throw new Error(`Upload cleanup failed for ${failed} files`);
  return cleaned;
}
