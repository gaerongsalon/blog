import redisConnect, {
  RedisConnection,
} from "@yingyeothon/naive-redis/lib/connection";

import secrets from "../env/secrets";

function connectToRedis(): RedisConnection {
  return redisConnect({
    host: secrets.redis.host,
    password: secrets.redis.password,
    timeoutMillis: 3000,
  });
}

export default connectToRedis;
