import S3 from "@blog/aws/lib/S3";
import getPrivateS3 from "./getPrivateS3";
import secrets from "@blog/config/lib/secrets";
import useS3cb from "@blog/aws/lib/useS3cb";

export default function getPrivateS3cb(): S3 {
  // Use S3 instead if there is no S3cb config.
  if (!secrets.s3cb) {
    return getPrivateS3();
  }
  return useS3cb({
    apiUrl: secrets.s3cb.url,
    apiId: secrets.s3cb.id,
    apiPassword: secrets.s3cb.password,
    keyPrefix: secrets.s3.internalKeyPrefix,
  });
}
