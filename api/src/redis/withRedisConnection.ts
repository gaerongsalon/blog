import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import getCacheOrConnectNew from "./getCacheOrConnectNew";

async function withRedisConnection<R>({
  doIn,
}: {
  doIn: (redisConnection: RedisConnection) => Promise<R>;
}): Promise<R> {
  return await doIn(getCacheOrConnectNew());
}

export default withRedisConnection;
