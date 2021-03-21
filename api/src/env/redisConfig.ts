import secrets from "./secrets";

const redisConfig = {
  host: secrets.redis.host,
  password: secrets.redis.password,
  timeoutMillis: 6 * 1000,
};

export default redisConfig;
