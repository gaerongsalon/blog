import secrets from "../env/secrets";
import useS3 from "../aws/useS3";

export default function getPublicS3(): ReturnType<typeof useS3> {
  return useS3({
    bucketName: secrets.s3.staticBucketName,
  });
}
