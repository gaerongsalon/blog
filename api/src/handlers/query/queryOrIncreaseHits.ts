import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import { getLogger } from "@yingyeothon/slack-logger";
import metadata from "../../metadata.json";
import redisGet from "@yingyeothon/naive-redis/lib/get";
import redisIncr from "@yingyeothon/naive-redis/lib/incr";
import withRedisConnection from "../../redis/withRedisConnection";

const logger = getLogger("queryOrIncreaseHits", __filename);

export default async function queryOrIncreaseHits(
  resource: string,
  id: string,
  isBot: boolean
): Promise<number> {
  async function query(connection: RedisConnection): Promise<number> {
    return +(
      (await redisGet(connection, buildRedisKeyForHit(resource, id))) ?? "0"
    );
  }
  async function increase(connection: RedisConnection): Promise<number> {
    return redisIncr(connection, buildRedisKeyForHit(resource, id));
  }

  try {
    const hits = await withRedisConnection({
      doIn: (connection) => (isBot ? query : increase)(connection),
    });
    logger.debug({ resource, id, isBot, hits }, "Query or increase hits");
    return hits;
  } catch (error) {
    logger.error({ resource, id, error }, "Cannot queryOrIncreaseHits");
    return 0;
  }
}

function buildRedisKeyForHit(resource: string, id: string) {
  return `blog/${metadata.blogId}::hit/${resource}/${id}`;
}
