import "source-map-support/register";

import { handleApi, throwError } from "./base";

import { APIGatewayProxyHandler } from "aws-lambda";
import createTables from "../db/createTables";
import deleteArticle from "../db/deleteArticle";
import { logger } from "../logger/logger";
import useRedisLock from "../redis/useRedisLock";
import useS3 from "../aws/useS3";
import useS3Sqlite from "../sqlite/useS3Sqlite";

const log = logger.get("handle:upsertArticle", __filename);

const dbKey = process.env.DB_KEY ?? "articles";
const dbLockRedisKey = "blog:lock:articles-db";

export const handle: APIGatewayProxyHandler = handleApi({
  log,
  handle: async (event) => {
    const slug = (event.pathParameters ?? {}).slug ?? throwError(404);
    log.debug({ slug }, "Article to delete");

    const { inLock } = useRedisLock();
    const { withDb } = useS3Sqlite(useS3());
    await inLock(withDb, {
      lockRedisKey: dbLockRedisKey,
    })({
      dbId: dbKey,
      createTableQuery: createTables,
      autoCommit: true,
      doIn: ({ db }) => {
        deleteArticle({ db, article: { slug } });
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
