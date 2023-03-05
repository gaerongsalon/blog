import * as AWS from "@aws-sdk/client-s3";
import * as fs from "fs";
import * as path from "path";

import S3, { S3Params } from "./S3";

import { PutObjectCommand } from "@aws-sdk/client-s3";
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
    acl?: string;
  }): Promise<string>;
}

export default function useS3({
  bucketName,
  keyPrefix = "",
}: S3Params): S3 & S3Extended {
  const s3 = new AWS.S3({});

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
        .then((result) => {
          if (result.Body) {
            result.Body.transformToByteArray()
              .then((bytes) => {
                fs.writeFileSync(localFile, bytes);
                resolve(localFile);
              })
              .catch(reject);
          } else {
            reject(new Error(`No object from S3`));
          }
        })
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
      }
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
