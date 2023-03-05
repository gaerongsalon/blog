import {
  RedisConfig,
  RedisConnection,
} from "@yingyeothon/naive-redis/lib/connection";

import getCacheOrConnectNew from "./getCacheOrConnectNew";

async function withRedisConnection<R>({
  doIn,
  ...config
}: {
  doIn: (redisConnection: RedisConnection) => Promise<R>;
} & RedisConfig): Promise<R> {
  return await doIn(getCacheOrConnectNew(config));
}

export default withRedisConnection;
