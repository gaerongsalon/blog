import * as AWS from "aws-sdk";
import * as fs from "fs";
import * as path from "path";

import S3, { S3Params } from "./S3";

import { contentType as contentTypeFromMimeType } from "mime-types";
import { getLogger } from "@yingyeothon/slack-logger";

const log = getLogger("useS3", __filename);

interface S3Extended {
  s3: AWS.S3;
  bucketName: string;
  getSignedUrl(args: {
    s3ObjectKey: string;
    contentType: string;
    expires?: number;
    acl?: string;
  }): string;
}

export default function useS3({
  bucketName,
  keyPrefix = "",
}: S3Params): S3 & S3Extended {
  const s3 = new AWS.S3();

  function downloadToLocal({
    s3ObjectKey,
    localFile,
  }: {
    s3ObjectKey: string;
    localFile: string;
  }): Promise<string> {
    const s3ObjectFullKey = keyPrefix + s3ObjectKey;
    log.trace({ s3ObjectFullKey, localFile }, "s3:downloadToLocal");
    return new Promise<string>((resolve, reject) =>
      s3
        .getObject({
          Bucket: bucketName,
          Key: s3ObjectFullKey,
        })
        .createReadStream()
        .on("error", reject)
        .pipe(
          fs.createWriteStream(localFile).on("close", () => resolve(localFile))
        )
    );
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
    return s3
      .upload({
        Bucket: bucketName,
        Key: s3ObjectFullKey,
        Body: fs.createReadStream(localFile),
        ContentType:
          contentTypeOrFalse !== false ? contentTypeOrFalse : undefined,
      })
      .promise();
  }

  function deleteKey({ s3ObjectKey }: { s3ObjectKey: string }) {
    const s3ObjectFullKey = keyPrefix + s3ObjectKey;
    log.trace({ s3ObjectFullKey }, "s3:deleteKey");
    return s3
      .deleteObject({
        Bucket: bucketName,
        Key: s3ObjectFullKey,
      })
      .promise();
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
    return s3
      .putObject({
        Bucket: bucketName,
        Key: s3ObjectFullKey,
        Body: !value ? "" : JSON.stringify(value),
      })
      .promise();
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
      .promise()
      .then((result) => {
        if (!result.Body) {
          return null;
        }
        return JSON.parse(result.Body as string) as T;
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
      await s3
        .headObject({
          Bucket: bucketName,
          Key: s3ObjectFullKey,
        })
        .promise();
      return true;
    } catch (error) {
      return false;
    }
  }

  function getSignedUrl({
    s3ObjectKey,
    contentType,
    expires = 60 * 10,
    acl = "public-read",
  }: {
    s3ObjectKey: string;
    contentType: string;
    expires?: number;
    acl?: string;
  }) {
    const s3ObjectFullKey = keyPrefix + s3ObjectKey;
    log.trace({ s3ObjectFullKey }, "s3:getSignedUrl");
    return s3.getSignedUrl("putObject", {
      Bucket: bucketName,
      Key: s3ObjectFullKey,
      Expires: expires,
      ContentType: contentType,
      ACL: acl,
    });
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
