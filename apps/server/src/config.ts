import { extension } from "mime-types";
import * as z from "zod";

const origin = (key: string) =>
  z
    .url(`${key} must be a valid URL`)
    .refine((value) => {
      const url = new URL(value);
      return (
        ["http:", "https:"].includes(url.protocol) &&
        !url.username &&
        !url.password &&
        url.pathname === "/" &&
        !url.search &&
        !url.hash
      );
    }, `${key} must be an HTTP(S) origin without a path or credentials`)
    .transform((value) => new URL(value).origin);

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().int().min(1).max(65535).default(3001),
    MONGODB_URI: z
      .string()
      .regex(/^mongodb(?:\+srv)?:\/\//)
      .optional(),
    TEST_MONGODB_URI: z
      .string()
      .regex(/^mongodb(?:\+srv)?:\/\//)
      .optional(),
    APP_URL: origin("APP_URL"),
    BETTER_AUTH_URL: origin("BETTER_AUTH_URL"),
    BETTER_AUTH_SECRET: z.string().trim().min(32),
    RESEND_API_KEY: z.string().trim().min(1).optional(),
    TRUST_PROXY: z.string().optional(),
    STORAGE_ENDPOINT: origin("STORAGE_ENDPOINT").optional(),
    STORAGE_REGION: z.string().trim().min(1).optional(),
    STORAGE_BUCKET: z.string().trim().min(1).optional(),
    STORAGE_ACCESS_KEY_ID: z.string().trim().min(1).optional(),
    STORAGE_SECRET_ACCESS_KEY: z.string().trim().min(1).optional(),
    STORAGE_MAX_UPLOAD_BYTES: z.coerce
      .number()
      .int()
      .positive()
      .max(5_000_000_000)
      .default(25 * 1024 * 1024),
    STORAGE_ALLOWED_MIME_TYPES: z
      .string()
      .default("image/jpeg,image/png,image/webp,application/pdf")
      .transform((value) => [
        ...new Set(value.split(",").map((mime) => mime.trim().toLowerCase())),
      ])
      .refine(
        (types) =>
          types.every(
            (mime) => /^[\w.+-]+\/[\w.+-]+$/.test(mime) && extension(mime),
          ),
        "STORAGE_ALLOWED_MIME_TYPES must contain comma-separated MIME types with known extensions",
      ),
    STORAGE_PENDING_MAX_AGE_HOURS: z.coerce
      .number()
      .int()
      .min(1)
      .max(8760)
      .default(24),
  })
  .superRefine((env, context) => {
    const storageKeys = [
      "STORAGE_ENDPOINT",
      "STORAGE_REGION",
      "STORAGE_BUCKET",
      "STORAGE_ACCESS_KEY_ID",
      "STORAGE_SECRET_ACCESS_KEY",
    ] as const;
    if (storageKeys.some((key) => env[key] !== undefined)) {
      for (const key of storageKeys) {
        if (!env[key])
          context.addIssue({
            code: "custom",
            path: [key],
            message: `${key} is required when storage is configured`,
          });
      }
    }
    const mongodbKey =
      env.NODE_ENV === "test" ? "TEST_MONGODB_URI" : "MONGODB_URI";
    if (!env[mongodbKey])
      context.addIssue({
        code: "custom",
        path: [mongodbKey],
        message: `${mongodbKey} is required when NODE_ENV=${env.NODE_ENV}`,
      });
    if (env.NODE_ENV === "production" && !env.RESEND_API_KEY)
      context.addIssue({
        code: "custom",
        path: ["RESEND_API_KEY"],
        message: "RESEND_API_KEY is required when NODE_ENV=production",
      });
    if (env.APP_URL !== env.BETTER_AUTH_URL)
      context.addIssue({
        code: "custom",
        path: ["BETTER_AUTH_URL"],
        message:
          "APP_URL and BETTER_AUTH_URL must match for this same-origin template",
      });
  });

export function readConfig(env: NodeJS.ProcessEnv) {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    const details = result.error.issues
      .map(
        (issue) =>
          `- ${issue.path.join(".") || "environment"}: ${issue.message}`,
      )
      .join("\n");
    throw new Error(`Invalid environment configuration:\n${details}`);
  }

  const parsed = result.data;
  const mongodbUri =
    parsed.NODE_ENV === "test" ? parsed.TEST_MONGODB_URI : parsed.MONGODB_URI;
  if (!mongodbUri) throw new Error("Invalid environment configuration");
  return {
    nodeEnv: parsed.NODE_ENV,
    port: parsed.PORT,
    mongodbUri,
    secret: parsed.BETTER_AUTH_SECRET,
    appUrl: parsed.APP_URL,
    authUrl: parsed.BETTER_AUTH_URL,
    resendApiKey: parsed.RESEND_API_KEY,
    storage:
      parsed.STORAGE_ENDPOINT &&
      parsed.STORAGE_REGION &&
      parsed.STORAGE_BUCKET &&
      parsed.STORAGE_ACCESS_KEY_ID &&
      parsed.STORAGE_SECRET_ACCESS_KEY
        ? {
            endpoint: parsed.STORAGE_ENDPOINT,
            region: parsed.STORAGE_REGION,
            bucket: parsed.STORAGE_BUCKET,
            accessKeyId: parsed.STORAGE_ACCESS_KEY_ID,
            secretAccessKey: parsed.STORAGE_SECRET_ACCESS_KEY,
          }
        : undefined,
    storageMaxUploadBytes: parsed.STORAGE_MAX_UPLOAD_BYTES,
    storageAllowedMimeTypes: parsed.STORAGE_ALLOWED_MIME_TYPES,
    storagePendingMaxAgeHours: parsed.STORAGE_PENDING_MAX_AGE_HOURS,
    trustProxy:
      parsed.TRUST_PROXY?.split(",")
        .map((value) => value.trim())
        .filter(Boolean) ?? [],
  };
}

export type Config = ReturnType<typeof readConfig>;
