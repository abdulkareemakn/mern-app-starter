import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { Config } from "#/config";

function isNotFound(error: unknown) {
  return (
    error instanceof S3ServiceException &&
    error.$metadata.httpStatusCode === 404
  );
}

// One client per application/job; configuration stays at the startup boundary.
export function createStorage(config: NonNullable<Config["storage"]>) {
  const client = new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    forcePathStyle: true,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    // Do not sign an SDK-generated checksum of an empty body for direct uploads.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
  const object = (key: string) => ({ Bucket: config.bucket, Key: key });

  return {
    getPresignedPutUrl(
      key: string,
      contentType: string,
      contentLength: number,
    ) {
      return getSignedUrl(
        client,
        new PutObjectCommand({
          ...object(key),
          ContentType: contentType,
          ContentLength: contentLength,
        }),
        {
          expiresIn: 300,
          signableHeaders: new Set(["content-type", "content-length"]),
        },
      );
    },
    getPresignedGetUrl(key: string) {
      return getSignedUrl(
        client,
        new GetObjectCommand({
          ...object(key),
          ResponseContentDisposition: "attachment",
        }),
        { expiresIn: 300 },
      );
    },
    async headObject(key: string) {
      try {
        return await client.send(new HeadObjectCommand(object(key)));
      } catch (error) {
        if (isNotFound(error)) return undefined;
        throw error;
      }
    },
    async deleteObject(key: string) {
      try {
        await client.send(new DeleteObjectCommand(object(key)));
      } catch (error) {
        if (!isNotFound(error)) throw error;
      }
    },
    destroy: () => client.destroy(),
  };
}
