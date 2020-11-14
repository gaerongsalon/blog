const secrets = {
  redis: {
    host: process.env.REDIS_HOST!,
    password: process.env.REDIS_PASSWORD,
  },
  jwtSecretKey: process.env.JWT_SECRET_KEY!,
  s3BucketName: process.env.FILES_BUCKET!,
  dbKey: process.env.DB_KEY ?? "articles",
};

export default secrets;
