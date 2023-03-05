import S3 from "@blog/aws/lib/S3";
import getPrivateS3 from "./getPrivateS3";
import secrets from "@blog/config/lib/secrets";
import useS3cb from "@blog/aws/lib/useS3cb";

export default function getPrivateS3cb(): S3 {
  // Break type to achieve optional config.
  const { s3cb } = secrets as any;
  // Use S3 instead if there is no S3cb config.
  if (!s3cb) {
    return getPrivateS3();
  }
  return useS3cb({
    apiUrl: s3cb.url,
    apiId: s3cb.id,
    apiPassword: s3cb.password,
    keyPrefix: secrets.s3.internalKeyPrefix,
  });
}
