import * as fs from "fs";

import S3, { S3Params } from "./S3";

import S3cb from "@yingyeothon/s3-cache-bridge-client";
import S3cbEnv from "@yingyeothon/s3-cache-bridge-client/lib/env";
import { getLogger } from "@yingyeothon/slack-logger";
import { promisify } from "util";

const log = getLogger("useS3", __filename);

export default function useS3cb({
  keyPrefix = "",
  apiUrl,
  apiId,
  apiPassword,
}: Omit<S3Params, "bucketName"> & S3cbEnv): S3 {
  const cb = S3cb({
    apiUrl,
    apiId,
    apiPassword,
  });

  function downloadToLocal({
    s3ObjectKey,
    localFile,
  }: {
    s3ObjectKey: string;
    localFile: string;
  }): Promise<string> {
    const s3ObjectFullKey = keyPrefix + s3ObjectKey;
    log.trace({ s3ObjectFullKey, localFile }, "s3:downloadToLocal");
    return cb.download(s3ObjectFullKey, localFile);
  }

  async function uploadLocalFile({
    s3ObjectKey,
    localFile,
  }: {
    s3ObjectKey: string;
    localFile: string;
  }) {
    const s3ObjectFullKey = keyPrefix + s3ObjectKey;
    log.trace({ s3ObjectFullKey, localFile }, "s3:uploadLocalFile");
    const buffer = await promisify(fs.readFile)(localFile);
    return cb.put(s3ObjectFullKey, buffer);
  }

  function deleteKey({ s3ObjectKey }: { s3ObjectKey: string }) {
    const s3ObjectFullKey = keyPrefix + s3ObjectKey;
    log.trace({ s3ObjectFullKey }, "s3:deleteKey");
    return cb.del(s3ObjectFullKey);
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
    return cb.put(s3ObjectFullKey, !value ? "" : JSON.stringify(value));
  }

  async function getJSON<T>({
    s3ObjectKey,
  }: {
    s3ObjectKey: string;
    nullIfAbsent?: boolean;
  }): Promise<T | null> {
    const s3ObjectFullKey = keyPrefix + s3ObjectKey;
    log.trace({ s3ObjectFullKey }, "s3:getJSON");
    const body = await cb.get(s3ObjectFullKey);
    return JSON.parse(body) as T;
  }

  async function exists({
    s3ObjectKey,
  }: {
    s3ObjectKey: string;
  }): Promise<boolean> {
    const s3ObjectFullKey = keyPrefix + s3ObjectKey;
    log.trace({ s3ObjectFullKey }, "s3:exists");
    return cb.exists(s3ObjectFullKey);
  }

  return {
    downloadToLocal,
    uploadLocalFile,
    deleteKey,
    getJSON,
    putJSON,
    exists,
  };
}
