import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import redisDel from "@yingyeothon/naive-redis/lib/del";
import redisGet from "@yingyeothon/naive-redis/lib/get";

type ReleaseParams = {
  lockRedisKey: string;
  lockToken: string;
};
export type ReleaseLock = (params: ReleaseParams) => Promise<void>;

function redisReleaseLock({
  connection,
}: {
  connection: RedisConnection;
}): ReleaseLock {
  return async function releaseLock({
    lockRedisKey,
    lockToken,
  }: ReleaseParams): Promise<void> {
    const currentLockToken = await redisGet(connection, lockRedisKey);
    if (currentLockToken === null) {
      throw new Error(`Lock is already released: [${lockToken}]`);
    }
    if (currentLockToken !== lockToken) {
      throw new Error(
        `Invalid lock token: [${lockToken}] <> [${currentLockToken}]`
      );
    }
    await redisDel(connection, lockRedisKey);
  };
}

export default redisReleaseLock;
