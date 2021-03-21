import S3 from "@libs/aws/S3";
import secrets from "../env/secrets";
import useS3cb from "@libs/aws/useS3cb";

export default function getPrivateS3cb(): S3 {
  return useS3cb({
    apiUrl: secrets.s3cb.url,
    apiId: secrets.s3cb.id,
    apiPassword: secrets.s3cb.password,
    keyPrefix: secrets.s3.internalKeyPrefix,
  });
}
