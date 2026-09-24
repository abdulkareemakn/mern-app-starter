import * as z from "zod";
import type { Config } from "#/config";

export function createUploadSchema(config: Config) {
  return z.object({
    filename: z
      .string()
      .trim()
      .min(1)
      .max(255)
      .regex(/^[^\p{Cc}]+$/u, "Filename must not contain control characters"),
    mimeType: z
      .string()
      .refine(
        (value) => config.storageAllowedMimeTypes.includes(value),
        "MIME type is not allowed",
      ),
    sizeBytes: z
      .number()
      .int()
      .positive()
      .max(
        config.storageMaxUploadBytes,
        `File exceeds the ${config.storageMaxUploadBytes} byte upload limit`,
      ),
  });
}

export const uploadParamsSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid file ID"),
});

// Confirmation and download accept no payload; IDs are validated separately.
export const emptyUploadBodySchema = z.strictObject({}).optional();
