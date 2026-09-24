import {
  DeleteObjectCommand,
  HeadObjectCommand,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { afterEach, expect, test, vi } from "vitest";
import { createStorage } from "../../apps/server/src/lib/storage.ts";

const credentials = {
  bucket: "test-bucket",
  accessKeyId: "test-access-key",
  secretAccessKey: "test-secret-key",
};
afterEach(() => vi.restoreAllMocks());

test.each([
  ["https://account.r2.cloudflarestorage.com", "auto"],
  ["https://s3.us-west-004.backblazeb2.com", "us-west-004"],
])("signs PUT type/length and private GET for %s", async (endpoint, region) => {
  const storage = createStorage({ ...credentials, endpoint, region });
  const key = "owner/uuid.png";
  try {
    const put = new URL(
      await storage.getPresignedPutUrl(key, "image/png", 123),
    );
    expect(put.origin).toBe(endpoint);
    expect(put.pathname).toBe(`/test-bucket/${key}`);
    expect(put.searchParams.get("X-Amz-SignedHeaders")?.split(";")).toEqual([
      "content-length",
      "content-type",
      "host",
    ]);
    expect(put.searchParams.get("X-Amz-Expires")).toBe("300");
    expect(put.searchParams.get("X-Amz-Credential")).toContain(
      `/${region}/s3/`,
    );
    expect(put.searchParams.has("x-amz-checksum-crc32")).toBe(false);
    for (const [mime, size] of [
      ["image/jpeg", 123],
      ["image/png", 124],
    ] as const) {
      const changed = new URL(
        await storage.getPresignedPutUrl(key, mime, size),
      );
      expect(changed.searchParams.get("X-Amz-Signature")).not.toBe(
        put.searchParams.get("X-Amz-Signature"),
      );
    }
    const get = new URL(await storage.getPresignedGetUrl(key));
    expect(get.origin).toBe(endpoint);
    expect(get.searchParams.get("X-Amz-Expires")).toBe("300");
    expect(get.searchParams.get("response-content-disposition")).toBe(
      "attachment",
    );
  } finally {
    storage.destroy();
  }
});

test("HEAD and DELETE ignore only missing objects, not storage failures", async () => {
  const storage = createStorage({
    ...credentials,
    endpoint: "https://storage.example.com",
    region: "auto",
  });
  const send = vi.spyOn(S3Client.prototype, "send");
  const error = (status: number) =>
    new S3ServiceException({
      name: "StorageError",
      $fault: "client",
      $metadata: { httpStatusCode: status },
    });
  try {
    send.mockRejectedValue(error(404));
    await expect(storage.headObject("missing")).resolves.toBeUndefined();
    expect(send.mock.calls[0][0]).toBeInstanceOf(HeadObjectCommand);
    await expect(storage.deleteObject("missing")).resolves.toBeUndefined();
    expect(send.mock.calls[1][0]).toBeInstanceOf(DeleteObjectCommand);
    expect(send.mock.calls[1][0].input).toEqual({
      Bucket: "test-bucket",
      Key: "missing",
    });
    send.mockRejectedValue(error(403));
    await expect(storage.headObject("private")).rejects.toThrow();
    await expect(storage.deleteObject("private")).rejects.toThrow();
  } finally {
    storage.destroy();
  }
});
