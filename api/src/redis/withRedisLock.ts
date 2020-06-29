import { AcquireLock, AcquireParams } from "./redisAcquireLock";

import { ReleaseLock } from "./redisReleaseLock";

type WithParams<R> = { doIn: () => Promise<R> } & AcquireParams;
type WithResult<R> = { result?: R; executed: boolean };
export type WithLock<R> = (params: WithParams<R>) => Promise<WithResult<R>>;

function withRedisLock({
  acquireLock,
  releaseLock,
}: {
  acquireLock: AcquireLock;
  releaseLock: ReleaseLock;
}) {
  return async function withLock<R>(
    params: WithParams<R>
  ): Promise<WithResult<R>> {
    const locked = await acquireLock(params);
    if (!locked.acquired) {
      return { executed: false };
    }
    try {
      const { doIn } = params;
      const result = await doIn();
      return { result, executed: true };
    } finally {
      await releaseLock({ ...params, lockToken: locked.lockToken! });
    }
  };
}

export default withRedisLock;
