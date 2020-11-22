import { getLogger } from "@yingyeothon/slack-logger";
import withRedisCache from "../redis/withRedisCache";

const cacheVersion = 1;
const cacheKeyPrefix = `hoppipolla::blog::${cacheVersion}::`;

const log = getLogger("cacheOr", __filename);

export default async function cacheOr<T>({
  cacheKey,
  compute,
  expirationMillis = 300 * 1000,
}: {
  cacheKey: string;
  compute: () => Promise<T>;
  expirationMillis?: number;
}): Promise<T> {
  const fullCacheKey = cacheKeyPrefix + cacheKey;
  log.trace({ fullCacheKey, expirationMillis }, "Cache or compute");
  return await withRedisCache({
    cacheKey: fullCacheKey,
    compute,
    expirationMillis,
  });
}
