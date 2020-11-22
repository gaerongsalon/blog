type S3KeyParameter = { s3ObjectKey: string };
type S3KeyWithLocalFileParameter = S3KeyParameter & { localFile: string };

export interface S3Params {
  bucketName: string;
  keyPrefix?: string;
}

export default interface S3 {
  downloadToLocal(args: S3KeyWithLocalFileParameter): Promise<string>;
  uploadLocalFile(args: S3KeyWithLocalFileParameter): Promise<unknown>;
  deleteKey(args: S3KeyParameter): Promise<unknown>;
  putJSON<T>(args: S3KeyParameter & { value: T }): Promise<unknown>;
  getJSON<T>(args: S3KeyParameter): Promise<T | null>;
  exists(args: S3KeyParameter): Promise<boolean>;
}
