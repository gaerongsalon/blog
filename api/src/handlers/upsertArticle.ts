import "source-map-support/register";

import { ApiError, handleApi, throwError } from "./base";
import Article, { validateArticle } from "../db/article";

import { APIGatewayProxyHandler } from "aws-lambda";
import createTables from "../db/createTables";
import { logger } from "../logger/logger";
import upsertArticle from "../db/upsertArticle";
import useRedisLock from "../redis/useRedisLock";
import useS3 from "../aws/useS3";
import useS3Sqlite from "../sqlite/useS3Sqlite";

const log = logger.get("handle:upsertArticle", __filename);

const dbKey = process.env.DB_KEY ?? "articles";
const dbLockRedisKey = "blog:lock:articles-db";

export const handle: APIGatewayProxyHandler = handleApi({
  log,
  handle: async (event) => {
    const slug = (event.pathParameters ?? {}).id ?? throwError(404);
    const article = { ...(JSON.parse(event.body ?? "{}") as Article), slug };
    log.debug({ slug, article }, "Article to upsert");
    if (!validateArticle(article)) {
      throw new ApiError(404);
    }

    const { inLock } = useRedisLock();
    const { withDb } = useS3Sqlite(useS3());
    await inLock(withDb, {
      lockRedisKey: dbLockRedisKey,
    })({
      dbId: dbKey,
      createTableQuery: createTables,
      autoCommit: true,
      doIn: ({ db }) => {
        upsertArticle({ db, article });
      },
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  },
  options: {
    accesslog: true,
  },
});
