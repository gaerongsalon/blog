import "source-map-support/register";

import { ApiError, handleApi, throwError } from "./base";
import Article, { validateArticle } from "../db/article";

import { APIGatewayProxyHandler } from "aws-lambda";
import createTables from "../db/createTables";
import { getLogger } from "@yingyeothon/slack-logger";
import insertArticle from "../db/insertArticle";
import secrets from "../env/secrets";
import updateArticle from "../db/updateArticle";
import useRedisLock from "../redis/useRedisLock";
import useS3 from "../aws/useS3";
import useS3Sqlite from "../sqlite/useS3Sqlite";

const logger = getLogger("handle:upsertArticle", __filename);

const dbLockRedisKey = "blog:lock:articles-db";

export const handle: APIGatewayProxyHandler = handleApi({
  logger,
  handle: async (event) => {
    const slug = (event.pathParameters ?? {}).slug ?? throwError(404);
    const article = { ...(JSON.parse(event.body ?? "{}") as Article), slug };
    logger.debug({ slug, article }, "Article to upsert");
    if (!validateArticle(article, { withoutSerial: true })) {
      throw new ApiError(404);
    }

    const { inLock } = useRedisLock();
    const { withDb } = useS3Sqlite(useS3());
    await inLock(withDb, {
      lockRedisKey: dbLockRedisKey,
    })({
      dbId: secrets.dbKey,
      createTableQuery: createTables,
      autoCommit: true,
      doIn: ({ db }) => {
        if ("serial" in article && article.serial > 0) {
          updateArticle({ db, article });
        } else {
          insertArticle({ db, article });
        }
      },
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  },
  options: {
    accesslog: true,
    authorization: true,
  },
});
