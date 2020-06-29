import redisConnect, {
  IRedisConnection,
} from "@yingyeothon/naive-redis/lib/connection";

function connectToRedis(): IRedisConnection {
  return redisConnect({
    host: process.env.REDIS_HOST!,
    password: process.env.REDIS_PASSWORD,
    timeoutMillis: 3000,
  });
}

export default connectToRedis;
