import secretsJson from "../secrets.json";

export interface Secrets {
  name: string;
  writers: {
    email: string;
    name: string;
  }[];
  redis: {
    host: string;
    password: string;
    timeoutMillis: number;
  };
  jwtSecretKey: string;
  s3: {
    internalKeyPrefix: string;
    internalBucketName: string;
    staticBucketName: string;
  };
  s3cb: {
    url: string;
    id: string;
    password: string;
  };
  dbKey: string;
  logger: {
    slackWebhookUrl: string;
    slackChannel: string;
    slackLogLevel: string;
    consoleLogLevel: string;
  };
  url: {
    datePattern: {
      support: true;
      startYear: number;
      endYear: number;
    };
  };
}

const secrets = secretsJson as Secrets;

export default secrets;
