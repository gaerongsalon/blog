import redisConnect, {
  RedisConfig,
  RedisConnection,
} from "@yingyeothon/naive-redis/lib/connection";

const expirationMillis = 3 * 60 * 1000;
const connectionCache: {
  connection: RedisConnection | null;
  expired: number;
} = {
  connection: null,
  expired: 0,
};

export function getCacheOrConnectNew(config: RedisConfig): RedisConnection {
  if (
    connectionCache.connection !== null &&
    connectionCache.expired > Date.now()
  ) {
    return connectionCache.connection;
  }
  if (connectionCache.connection !== null) {
    connectionCache.connection.socket.disconnect();
  }

  connectionCache.connection = redisConnect(config);
  connectionCache.expired = Date.now() + expirationMillis;
  return connectionCache.connection;
}

export default getCacheOrConnectNew;
