import redisGet from "@yingyeothon/naive-redis/lib/get";
import redisSet from "@yingyeothon/naive-redis/lib/set";
import withRedisConnection from "./withRedisConnection";

export default async function withRedisCache<T>({
  cacheKey,
  compute,
  expirationMillis,
}: {
  cacheKey: string;
  compute: () => Promise<T>;
  expirationMillis: number;
}): Promise<T> {
  return await withRedisConnection({
    doIn: async (redisConnection) => {
      const maybe = await redisGet(redisConnection, cacheKey);
      if (!!maybe) {
        return JSON.parse(decodeURIComponent(maybe)) as T;
      }
      const newOne = await compute();
      await redisSet(
        redisConnection,
        cacheKey,
        encodeURIComponent(JSON.stringify(newOne)),
        {
          expirationMillis,
        }
      );
      return newOne;
    },
  });
}
