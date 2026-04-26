import * as AWS from "@aws-sdk/client-s3";
import * as fs from "fs";
import * as path from "path";

import S3, { S3Params } from "./S3";

import { ObjectCannedACL, PutObjectCommand } from "@aws-sdk/client-s3";
import { contentType as contentTypeFromMimeType } from "mime-types";
import { getLogger } from "@yingyeothon/slack-logger";
import { getSignedUrl as s3GetSignedUrl } from "@aws-sdk/s3-request-presigner";

const log = getLogger("useS3", __filename);

interface S3Extended {
  s3: AWS.S3;
  bucketName: string;
  getSignedUrl(args: {
    s3ObjectKey: string;
    contentType: string;
    expires?: number;
    acl?: ObjectCannedACL;
  }): Promise<string>;
}

function isAbsentObjectError(error: unknown): boolean {
  const maybe = error as {
    name?: string;
    Code?: string;
    $metadata?: { httpStatusCode?: number };
  };
  return (
    maybe.$metadata?.httpStatusCode === 404 ||
    maybe.name === "NotFound" ||
    maybe.name === "NoSuchKey" ||
    maybe.Code === "NoSuchKey"
  );
}

export default function useS3({
  bucketName,
  keyPrefix = "",
}: S3Params): S3 & S3Extended {
  const s3 = new AWS.S3({});

  async function downloadToLocal({
    s3ObjectKey,
    localFile,
  }: {
    s3ObjectKey: string;
    localFile: string;
  }): Promise<string> {
    const s3ObjectFullKey = keyPrefix + s3ObjectKey;
    log.trace({ s3ObjectFullKey, localFile }, "s3:downloadToLocal");
    const result = await s3.getObject({
      Bucket: bucketName,
      Key: s3ObjectFullKey,
    });
    if (!result.Body) {
      throw new Error(`No object from S3: ${s3ObjectFullKey}`);
    }
    fs.writeFileSync(localFile, await result.Body.transformToByteArray());
    return localFile;
  }

  function uploadLocalFile({
    s3ObjectKey,
    localFile,
    contentType,
  }: {
    s3ObjectKey: string;
    localFile: string;
    contentType?: string;
  }) {
    const s3ObjectFullKey = keyPrefix + s3ObjectKey;
    log.trace({ s3ObjectFullKey, localFile }, "s3:uploadLocalFile");
    const contentTypeOrFalse =
      contentType ?? contentTypeFromMimeType(path.extname(localFile));
    return s3.putObject({
      Bucket: bucketName,
      Key: s3ObjectFullKey,
      Body: fs.createReadStream(localFile),
      ContentType:
        typeof contentTypeOrFalse === "string" ? contentTypeOrFalse : undefined,
    });
  }

  function deleteKey({ s3ObjectKey }: { s3ObjectKey: string }) {
    const s3ObjectFullKey = keyPrefix + s3ObjectKey;
    log.trace({ s3ObjectFullKey }, "s3:deleteKey");
    return s3.deleteObject({
      Bucket: bucketName,
      Key: s3ObjectFullKey,
    });
  }

  function putJSON<T>({
    s3ObjectKey,
    value,
  }: {
    s3ObjectKey: string;
    value: T | null;
  }) {
    const s3ObjectFullKey = keyPrefix + s3ObjectKey;
    log.trace({ s3ObjectFullKey, value }, "s3:putJSON");
    return s3.putObject({
      Bucket: bucketName,
      Key: s3ObjectFullKey,
      Body: !value ? "" : JSON.stringify(value),
    });
  }

  function getJSON<T>({
    s3ObjectKey,
  }: {
    s3ObjectKey: string;
    nullIfAbsent?: boolean;
  }): Promise<T | null> {
    const s3ObjectFullKey = keyPrefix + s3ObjectKey;
    log.trace({ s3ObjectFullKey }, "s3:getJSON");
    return s3
      .getObject({
        Bucket: bucketName,
        Key: s3ObjectFullKey,
      })
      .then((result) => {
        if (!result.Body) {
          return null;
        }
        return result.Body.transformToString();
      })
      .then((maybe) => {
        if (!maybe) {
          return null;
        }
        return JSON.parse(maybe) as T;
      });
  }

  async function exists({
    s3ObjectKey,
  }: {
    s3ObjectKey: string;
  }): Promise<boolean> {
    const s3ObjectFullKey = keyPrefix + s3ObjectKey;
    log.trace({ s3ObjectFullKey }, "s3:exists");
    try {
      await s3.headObject({
        Bucket: bucketName,
        Key: s3ObjectFullKey,
      });
      return true;
    } catch (error: unknown) {
      if (isAbsentObjectError(error)) {
        return false;
      }
      throw error;
    }
  }

  function getSignedUrl({
    s3ObjectKey,
    contentType,
    expires = 60 * 10,
    acl = ObjectCannedACL.public_read,
  }: {
    s3ObjectKey: string;
    contentType: string;
    expires?: number;
    acl?: ObjectCannedACL;
  }) {
    const s3ObjectFullKey = keyPrefix + s3ObjectKey;
    log.trace({ s3ObjectFullKey }, "s3:getSignedUrl");
    return s3GetSignedUrl(
      s3,
      new PutObjectCommand({
        Bucket: bucketName,
        Key: s3ObjectFullKey,
        ContentType: contentType,
        ACL: acl,
      }),
      {
        expiresIn: expires,
      },
    );
  }

  return {
    s3,
    bucketName,
    downloadToLocal,
    uploadLocalFile,
    deleteKey,
    getJSON,
    putJSON,
    exists,
    getSignedUrl,
  };
}
