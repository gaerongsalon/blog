const secrets = {
  redis: {
    host: process.env.REDIS_HOST!,
    password: process.env.REDIS_PASSWORD,
  },
  jwtSecretKey: process.env.JWT_SECRET_KEY!,
  s3: {
    internalKeyPrefix: process.env.INTERNAL_FILE_S3_PREFIX!,
    internalBucketName: process.env.INTERNAL_FILE_BUCKET!,
    staticBucketName: process.env.STATIC_FILE_BUCKET!,
  },
  s3cb: {
    url: process.env.S3CB_URL!,
    id: process.env.S3CB_ID!,
    password: process.env.S3CB_PASSWORD!,
  },
  dbKey: process.env.DB_KEY ?? "articles",
};

export default secrets;
