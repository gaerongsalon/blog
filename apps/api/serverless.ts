import { Serverless } from "serverless/aws";
import functions from "./src/handlers/functions";
import secrets from "@blog/config/lib/secrets";

const serverlessConfiguration: Serverless = {
  service: `${secrets.name}-blog-api`,
  frameworkVersion: "3",
  plugins: [
    "serverless-plugin-scripts",
    "serverless-esbuild",
    "serverless-prune-plugin",
    "serverless-offline",
  ],
  custom: {
    webpack: {
      includeModules: {
        forceExclude: ["aws-sdk", "better-sqlite3", "sharp"],
      },
    },
    prune: {
      automatic: true,
      number: 7,
    },
    scripts: {
      hooks: {
        "webpack:package:packExternalModules": "/bin/bash .prepackage.sh",
      },
    },
    esbuild: {
      bundle: true,
      minify: true,
      exclude: ["aws-sdk", "better-sqlite3", "sharp"],
      packager: "pnpm",
      watch: {
        pattern: ["src/**/*.ts"],
      },
    },
  },
  package: {
    excludeDevDependencies: true,
    individually: true,
  },
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    region: "ap-northeast-2",
    stage: process.env.STAGE ?? "dev",
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
              `arn:aws:s3:::${secrets.s3.internalBucketName}/*`,
              `arn:aws:s3:::${secrets.s3.staticBucketName}/*`,
            ],
          },
        ],
      } as any, // TODO: The type of "iam.role" seems to be broken.
    },
  },
  functions,
};

module.exports = serverlessConfiguration;
