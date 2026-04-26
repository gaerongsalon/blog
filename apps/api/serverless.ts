import type { AWS } from "@serverless/typescript";
import functions from "./src/handlers/functions";
import secrets from "@blog/config/lib/secrets";

const serverlessConfiguration: AWS = {
  service: `${secrets.name}-blog-api`,
  frameworkVersion: "4",
  plugins: ["serverless-offline"],
  build: {
    esbuild: {
      bundle: true,
      minify: true,
      external: ["aws-sdk", "better-sqlite3", "sharp"],
    },
  },
  package: {
    excludeDevDependencies: true,
    individually: true,
  },
  provider: {
    name: "aws",
    runtime: "nodejs22.x",
    region: "ap-northeast-2",
    stage: process.env.STAGE ?? "dev",
    versionFunctions: false,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      binaryMediaTypes: ["image/*"],
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      SLACK_WEBHOOK_URL: secrets.logger.slackWebhookUrl,
      SLACK_CHANNEL: secrets.logger.slackChannel,
      SLACK_LOG_LEVEL: secrets.logger.slackLogLevel,
      CONSOLE_LOG_LEVEL: secrets.logger.consoleLogLevel,
    },
    memorySize: 256,
    timeout: 5,
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "s3:GetObject",
              "s3:GetObjectAcl",
              "s3:PutObject",
              "s3:PutObjectAcl",
              "s3:HeadObject",
              "s3:DeleteObject",
            ],
            Resource: [
              `arn:aws:s3:::${secrets.s3.internalBucketName}/*`,
              `arn:aws:s3:::${secrets.s3.staticBucketName}/*`,
            ],
          },
          {
            Effect: "Allow",
            Action: ["s3:ListBucket"],
            Resource: [
              `arn:aws:s3:::${secrets.s3.internalBucketName}`,
              `arn:aws:s3:::${secrets.s3.staticBucketName}`,
            ],
          },
        ],
      },
    },
  },
  functions,
};

module.exports = serverlessConfiguration;
