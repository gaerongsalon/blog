import redisAcquireLock, { AcquireParams } from "./redisAcquireLock";

import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import getCacheOrConnectNew from "./getCacheOrConnectNew";
import redisReleaseLock from "./redisReleaseLock";
import withRedisLock from "./withRedisLock";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function useRedisLock({
  redisConnection = getCacheOrConnectNew(),
}: {
  redisConnection?: RedisConnection;
} = {}) {
  const acquireLock = redisAcquireLock({ connection: redisConnection });
  const releaseLock = redisReleaseLock({ connection: redisConnection });
  const withLock = withRedisLock({ acquireLock, releaseLock });

  function inLock<Args extends unknown[], ReturnType>(
    fn: (...args: Args) => Promise<ReturnType>,
    lockOptions: AcquireParams
  ): (...args: Args) => Promise<ReturnType> {
    return async function delegate(...args: Args): Promise<ReturnType> {
      const { executed, result } = await withLock<ReturnType>({
        ...lockOptions,
        doIn: async () => await fn(...args),
      });
      if (!executed) {
        throw new Error("Lock timeout");
      }
      return result!;
    };
  }
  return { acquireLock, releaseLock, withLock, inLock };
}
