import { randomUUID } from "node:crypto";
import type {
  ApiError,
  CreateUploadResponse,
  DownloadUploadResponse,
  FileResponse,
} from "@mern/shared";
import { type RequestHandler, Router } from "express";
import { extension } from "mime-types";
import type { Config } from "#/config";
import { createStorage } from "#/lib/storage";
import type { AuthenticatedLocals } from "#/middleware/auth";
import { type ValidatedLocals, validate } from "#/middleware/validate";
import { File } from "#/models/file";
import {
  createUploadSchema,
  emptyUploadBodySchema,
  uploadParamsSchema,
} from "#/schemas/uploads";

export function uploadsRouter(config: Config) {
  const router = Router();
  router.use((_req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
  });
  if (!config.storage) {
    router.use((_req, res) => {
      res
        .status(503)
        .json({ error: "File storage is not configured" } satisfies ApiError);
    });
    return router;
  }
  const storage = createStorage(config.storage);
  const createRequest = { body: createUploadSchema(config) };
  type CreateLocals = AuthenticatedLocals &
    ValidatedLocals<typeof createRequest>;

  router.post<never, unknown, unknown, unknown, CreateLocals>(
    "/",
    validate(createRequest),
    async (_req, res) => {
      const { filename, mimeType, sizeBytes } = res.locals.validated.body;
      const ownerId = res.locals.session.user.id;
      const key = `${ownerId}/${randomUUID()}.${extension(mimeType)}`;
      const file = await File.create({
        key,
        ownerId,
        originalName: filename,
        mimeType,
        sizeBytes,
      });
      const uploadUrl = await storage.getPresignedPutUrl(
        key,
        mimeType,
        sizeBytes,
      );
      res.status(201).json({
        fileId: file.id,
        uploadUrl,
        key,
      } satisfies CreateUploadResponse);
    },
  );

  const fileRequest = {
    params: uploadParamsSchema,
    body: emptyUploadBodySchema,
  };
  type FileLocals = AuthenticatedLocals &
    ValidatedLocals<typeof fileRequest> & { file: InstanceType<typeof File> };
  const loadFile: RequestHandler<
    never,
    unknown,
    unknown,
    unknown,
    FileLocals
  > = async (_req, res, next) => {
    const file = await File.findById(res.locals.validated.params.id);
    if (!file) {
      res.status(404).json({ error: "File not found" } satisfies ApiError);
      return;
    }
    if (file.ownerId.toString() !== res.locals.session.user.id) {
      res
        .status(403)
        .json({ error: "You do not own this file" } satisfies ApiError);
      return;
    }
    res.locals.file = file;
    next();
  };

  router.post<never, unknown, unknown, unknown, FileLocals>(
    "/:id/confirm",
    validate(fileRequest),
    loadFile,
    async (_req, res) => {
      let file = res.locals.file;
      if (file.status === "pending") {
        const cutoff = () =>
          new Date(Date.now() - config.storagePendingMaxAgeHours * 3_600_000);
        if (file.createdAt <= cutoff()) {
          res.status(409).json({
            error: "Upload has expired; start a new upload",
          } satisfies ApiError);
          return;
        }
        const object = await storage.headObject(file.key);
        if (!object) {
          res
            .status(409)
            .json({ error: "Uploaded object not found" } satisfies ApiError);
          return;
        }
        if (
          object.ContentLength !== file.sizeBytes ||
          object.ContentType !== file.mimeType
        ) {
          res.status(422).json({
            error: "Uploaded object size or MIME type does not match",
          } satisfies ApiError);
          return;
        }
        // Recheck expiry atomically after HEAD: cleanup only handles expired pending files.
        const confirmed = await File.findOneAndUpdate(
          {
            _id: file._id,
            status: "pending",
            createdAt: { $gt: cutoff() },
          },
          { $set: { status: "confirmed", confirmedAt: new Date() } },
          { returnDocument: "after" },
        );
        if (!confirmed) {
          res.status(409).json({
            error: "Upload changed or expired; retry confirmation",
          } satisfies ApiError);
          return;
        }
        file = confirmed;
      }
      res.json({
        id: file.id,
        key: file.key,
        ownerId: file.ownerId.toString(),
        originalName: file.originalName,
        mimeType: file.mimeType,
        sizeBytes: file.sizeBytes,
        status: file.status,
        createdAt: file.createdAt.toISOString(),
        confirmedAt: file.confirmedAt?.toISOString() ?? null,
      } satisfies FileResponse);
    },
  );

  router.get<never, unknown, unknown, unknown, FileLocals>(
    "/:id",
    validate(fileRequest),
    loadFile,
    async (_req, res) => {
      const file = res.locals.file;
      if (file.status === "pending") {
        res
          .status(409)
          .json({ error: "Upload has not been confirmed" } satisfies ApiError);
        return;
      }
      res.json({
        downloadUrl: await storage.getPresignedGetUrl(file.key),
      } satisfies DownloadUploadResponse);
    },
  );
  return router;
}
