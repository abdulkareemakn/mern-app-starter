import { randomBytes, randomUUID } from "node:crypto";
import {
  DeleteObjectCommand,
  HeadObjectCommand,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import mongoose from "mongoose";
import request from "supertest";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import { createApp } from "../../apps/server/src/app.ts";
import { createAuth } from "../../apps/server/src/auth.ts";
import { readConfig } from "../../apps/server/src/config.ts";
import {
  connectDatabase,
  disconnectDatabase,
} from "../../apps/server/src/database.ts";
import { cleanupUploads } from "../../apps/server/src/jobs/cleanup-uploads.ts";
import { File } from "../../apps/server/src/models/file.ts";

const config = readConfig({
  NODE_ENV: "test",
  TEST_MONGODB_URI: process.env.TEST_MONGODB_URI,
  APP_URL: "http://localhost:3000",
  BETTER_AUTH_URL: "http://localhost:3000",
  BETTER_AUTH_SECRET: randomBytes(32).toString("hex"),
  STORAGE_ENDPOINT: "https://account.r2.cloudflarestorage.com",
  STORAGE_REGION: "auto",
  STORAGE_BUCKET: "test-bucket",
  STORAGE_ACCESS_KEY_ID: "test-key",
  STORAGE_SECRET_ACCESS_KEY: "test-secret",
  STORAGE_ALLOWED_MIME_TYPES: "image/png,application/pdf",
});
const dbName = `mern_test_${randomUUID().replaceAll("-", "")}`;
const send = vi.spyOn(S3Client.prototype, "send");
let app: ReturnType<typeof createApp>;
let owner: ReturnType<typeof request.agent>;
let other: ReturnType<typeof request.agent>;
let ownerId: string;
const body = { filename: "photo.exe", mimeType: "image/png", sizeBytes: 123 };

beforeAll(async () => {
  await connectDatabase(config.mongodbUri, dbName);
  app = createApp(createAuth(config), config);
  owner = request.agent(app);
  other = request.agent(app);
  for (const agent of [owner, other]) {
    const signup = await agent.post("/api/auth/sign-up/email").send({
      name: "Uploader",
      email: `${randomUUID()}@example.com`,
      password: randomBytes(24).toString("hex"),
    });
    expect(signup.status).toBe(200);
  }
  ownerId = (await owner.get("/api/me")).body.user.id;
});

beforeEach(async () => {
  await File.deleteMany({});
  send
    .mockReset()
    .mockResolvedValue({ ContentLength: 123, ContentType: "image/png" });
});

afterAll(async () => {
  vi.restoreAllMocks();
  if (mongoose.connection.name === dbName)
    await mongoose.connection.dropDatabase();
  await disconnectDatabase();
});

async function pending(overrides = {}) {
  return File.create({
    ownerId,
    key: `${ownerId}/${randomUUID()}.png`,
    originalName: body.filename,
    mimeType: body.mimeType,
    sizeBytes: body.sizeBytes,
    ...overrides,
  });
}

describe("uploads API", () => {
  test("all three endpoints require a session", async () => {
    const id = new mongoose.Types.ObjectId().toString();
    expect((await request(app).post("/api/uploads").send(body)).status).toBe(
      401,
    );
    expect((await request(app).post(`/api/uploads/${id}/confirm`)).status).toBe(
      401,
    );
    expect((await request(app).get(`/api/uploads/${id}`)).status).toBe(401);
    expect(send).not.toHaveBeenCalled();
  });

  test.each([
    [{ mimeType: "text/html" }, "mimeType"],
    [{ sizeBytes: config.storageMaxUploadBytes + 1 }, "sizeBytes"],
    [{ sizeBytes: 0 }, "sizeBytes"],
    [{ sizeBytes: 1.5 }, "sizeBytes"],
    [{ filename: " " }, "filename"],
    [{ filename: "bad\nname.png" }, "filename"],
  ])("rejects invalid upload metadata %j", async (invalid, field) => {
    const response = await owner
      .post("/api/uploads")
      .send({ ...body, ...invalid });
    expect(response.status).toBe(400);
    expect(response.body.details.fieldErrors[field]).toBeDefined();
    expect(await File.countDocuments()).toBe(0);
  });

  test("creates a pending file and signs the validated type and size", async () => {
    const response = await owner.post("/api/uploads").send(body);
    expect(response.status).toBe(201);
    expect(response.headers["cache-control"]).toBe("no-store");
    expect(response.body.key).toMatch(
      new RegExp(`^${ownerId}/[a-f0-9-]{36}\\.png$`),
    );
    expect(
      new URL(response.body.uploadUrl).searchParams.get("X-Amz-SignedHeaders"),
    ).toBe("content-length;content-type;host");
    expect(await File.findById(response.body.fileId).lean()).toMatchObject({
      key: response.body.key,
      originalName: "photo.exe",
      mimeType: "image/png",
      sizeBytes: 123,
      status: "pending",
      confirmedAt: null,
    });
  });

  test.each([
    "get",
    "confirm",
  ])("%s rejects non-owners, malformed IDs, and missing files", async (action) => {
    const file = await pending();
    const run = (agent: typeof owner, id: string) =>
      action === "get"
        ? agent.get(`/api/uploads/${id}`)
        : agent.post(`/api/uploads/${id}/confirm`);
    expect((await run(other, file.id)).status).toBe(403);
    expect((await run(owner, "invalid")).status).toBe(400);
    expect(
      (await run(owner, new mongoose.Types.ObjectId().toString())).status,
    ).toBe(404);
    expect(send).not.toHaveBeenCalled();
  });

  test("confirmation rejects a missing object and metadata mismatches", async () => {
    const file = await pending();
    send.mockRejectedValueOnce(
      new S3ServiceException({
        name: "NotFound",
        $fault: "client",
        $metadata: { httpStatusCode: 404 },
      }),
    );
    expect((await owner.post(`/api/uploads/${file.id}/confirm`)).status).toBe(
      409,
    );
    for (const object of [
      { ContentLength: 124, ContentType: "image/png" },
      { ContentLength: 123, ContentType: "application/pdf" },
    ]) {
      send.mockResolvedValueOnce(object);
      expect((await owner.post(`/api/uploads/${file.id}/confirm`)).status).toBe(
        422,
      );
    }
    expect((await File.findById(file.id))?.status).toBe("pending");
  });

  test("confirms metadata once and returns a private download URL", async () => {
    const file = await pending();
    expect((await owner.get(`/api/uploads/${file.id}`)).status).toBe(409);
    expect(
      (
        await owner
          .post(`/api/uploads/${file.id}/confirm`)
          .send({ unexpected: true })
      ).status,
    ).toBe(400);
    const confirmed = await owner
      .post(`/api/uploads/${file.id}/confirm`)
      .send({});
    expect(confirmed.status).toBe(200);
    expect(confirmed.body).toEqual({
      id: file.id,
      key: file.key,
      ownerId,
      originalName: "photo.exe",
      mimeType: "image/png",
      sizeBytes: 123,
      status: "confirmed",
      createdAt: file.createdAt.toISOString(),
      confirmedAt: expect.any(String),
    });
    expect((await File.findById(file.id))?.status).toBe("confirmed");
    expect(send.mock.calls[0][0]).toBeInstanceOf(HeadObjectCommand);
    expect(send.mock.calls[0][0].input).toEqual({
      Bucket: "test-bucket",
      Key: file.key,
    });
    expect((await owner.post(`/api/uploads/${file.id}/confirm`)).body).toEqual(
      confirmed.body,
    );
    expect(send).toHaveBeenCalledTimes(1);
    const download = await owner.get(`/api/uploads/${file.id}`);
    expect(download.status).toBe(200);
    expect(
      new URL(download.body.downloadUrl).searchParams.get("X-Amz-Expires"),
    ).toBe("300");
    expect(download.headers["cache-control"]).toBe("no-store");
  });

  test("expired pending files cannot be confirmed while cleanup runs", async () => {
    const file = await pending({
      createdAt: new Date(Date.now() - 25 * 3_600_000),
    });
    expect((await owner.post(`/api/uploads/${file.id}/confirm`)).status).toBe(
      409,
    );
    expect(send).not.toHaveBeenCalled();
  });

  test("rechecks expiry after a slow HEAD", async () => {
    const file = await pending();
    send.mockImplementationOnce(async () => {
      await File.collection.updateOne(
        { _id: file._id },
        { $set: { createdAt: new Date(Date.now() - 25 * 3_600_000) } },
      );
      return { ContentLength: 123, ContentType: "image/png" };
    });
    expect((await owner.post(`/api/uploads/${file.id}/confirm`)).status).toBe(
      409,
    );
    expect((await File.findById(file.id))?.status).toBe("pending");
  });

  test("storage failures use the standard error response and retain pending files", async () => {
    const file = await pending();
    send.mockRejectedValueOnce(new Error("private provider details"));
    const response = await owner.post(`/api/uploads/${file.id}/confirm`);
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal server error" });
    expect((await File.findById(file.id))?.status).toBe("pending");
  });

  test("unconfigured storage returns 503 for authenticated requests", async () => {
    const disabled = createApp(createAuth(config), {
      ...config,
      storage: undefined,
    });
    const agent = request.agent(disabled);
    await agent.post("/api/auth/sign-up/email").send({
      name: "Disabled",
      email: `${randomUUID()}@example.com`,
      password: randomBytes(24).toString("hex"),
    });
    expect((await agent.post("/api/uploads").send(body)).status).toBe(503);
  });
});

describe("upload cleanup", () => {
  test("deletes only expired pending files from the bucket and database", async () => {
    const old = new Date(Date.now() - 25 * 3_600_000);
    const expired = await pending({ createdAt: old });
    const confirmed = await pending({
      createdAt: old,
      status: "confirmed",
      confirmedAt: old,
    });
    const recent = await pending();
    expect(await cleanupUploads(config)).toBe(1);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][0]).toBeInstanceOf(DeleteObjectCommand);
    expect(send.mock.calls[0][0].input).toEqual({
      Bucket: "test-bucket",
      Key: expired.key,
    });
    expect(await File.findById(expired.id)).toBeNull();
    expect(await File.findById(confirmed.id)).not.toBeNull();
    expect(await File.findById(recent.id)).not.toBeNull();
  });

  test("honors the configured retention threshold and ignores missing bucket objects", async () => {
    const file = await pending({
      createdAt: new Date(Date.now() - 2 * 3_600_000),
    });
    expect(await cleanupUploads(config)).toBe(0);
    send.mockRejectedValueOnce(
      new S3ServiceException({
        name: "NoSuchKey",
        $fault: "client",
        $metadata: { httpStatusCode: 404 },
      }),
    );
    expect(
      await cleanupUploads({ ...config, storagePendingMaxAgeHours: 1 }),
    ).toBe(1);
    expect(await File.findById(file.id)).toBeNull();
  });

  test("retains failed deletions for retry while cleaning other files", async () => {
    const old = new Date(Date.now() - 25 * 3_600_000);
    const retained = await pending({ createdAt: old });
    const removed = await pending({ createdAt: old });
    send.mockImplementation(async (command) => {
      if (command.input.Key === retained.key)
        throw new Error("provider unavailable");
      return {};
    });
    await expect(cleanupUploads(config)).rejects.toThrow("1 files");
    expect(await File.findById(retained.id)).not.toBeNull();
    expect(await File.findById(removed.id)).toBeNull();
  });
});
