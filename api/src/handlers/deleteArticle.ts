import "source-map-support/register";

import { handleApi, throwError } from "./base";

import { APIGatewayProxyHandler } from "aws-lambda";
import createTables from "../db/createTables";
import deleteArticle from "../db/deleteArticle";
import encodedId from "../article/encodeId";
import { getLogger } from "@yingyeothon/slack-logger";
import getPrivateS3cb from "../support/getPrivateS3cb";
import secrets from "@config/secrets.json";
import useRedisLock from "@libs/redis/useRedisLock";
import useS3Sqlite from "@libs/sqlite/useS3Sqlite";

const logger = getLogger("handle:deleteArticle", __filename);

const dbLockRedisKey = "blog:lock:articles-db";

export const handle: APIGatewayProxyHandler = handleApi({
  logger: logger,
  handle: async (event) => {
    const slug = encodedId(
      (event.pathParameters ?? {})?.slug! ?? throwError(404)
    );
    logger.debug({ slug }, "Article to delete");

    const { inLock } = useRedisLock(secrets.redis);
    const { withDb } = useS3Sqlite(getPrivateS3cb());
    await inLock(withDb, {
      lockRedisKey: dbLockRedisKey,
    })({
      dbId: secrets.dbKey,
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
    authorization: true,
  },
});
