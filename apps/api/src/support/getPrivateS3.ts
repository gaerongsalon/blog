import secrets from "@blog/config/lib/secrets";
import useS3 from "@blog/aws/lib/useS3";

export default function getPrivateS3(): ReturnType<typeof useS3> {
  return useS3({
    bucketName: secrets.s3.internalBucketName,
    keyPrefix: secrets.s3.internalKeyPrefix,
  });
}
