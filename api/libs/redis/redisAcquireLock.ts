import DeadlineTimer from "../utils/deadlineTimer";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import { nanoid } from "nanoid";
import redisSet from "@yingyeothon/naive-redis/lib/set";
import sleep from "../utils/sleep";

export type AcquireParams = {
  lockRedisKey: string;
  expiredMillis?: number;
  waitMillis?: number;
  sleepIntervalMillis?: number;
};
export type Acquired = { lockToken?: string; acquired: boolean };
export type AcquireLock = (params: AcquireParams) => Promise<Acquired>;

function redisAcquireLock({
  connection,
}: {
  connection: RedisConnection;
}): AcquireLock {
  return async function acquireLock({
    lockRedisKey,
    expiredMillis = 30 * 1000,
    waitMillis = 20 * 5,
    sleepIntervalMillis = 20,
  }: AcquireParams): Promise<Acquired> {
    const lockToken = nanoid();
    const waiter = new DeadlineTimer(waitMillis);
    while (waiter.alive()) {
      const acquired = await redisSet(connection, lockRedisKey, lockToken, {
        expirationMillis: expiredMillis,
        onlySet: "nx",
      });
      if (acquired) {
        return { lockToken, acquired: true };
      }
      await sleep(sleepIntervalMillis);
    }
    return { acquired: false };
  };
}

export default redisAcquireLock;
