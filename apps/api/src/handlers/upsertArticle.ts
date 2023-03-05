import { ApiError, handleApi, throwError } from "./base";
import Article, { validateArticle } from "../db/entity/Article";

import { APIGatewayProxyHandler } from "aws-lambda";
import createTables from "../db/createTables";
import encodedId from "../article/encodeId";
import { getLogger } from "@yingyeothon/slack-logger";
import getPrivateS3cb from "../support/getPrivateS3cb";
import insertArticle from "../db/insertArticle";
import readWriter from "./authorization/readWriter";
import secrets from "@blog/config/lib/secrets";
import trimTags from "../article/trimTags";
import updateArticle from "../db/updateArticle";
import useRedisLock from "@blog/redis/lib/useRedisLock";
import useS3Sqlite from "@blog/sqlite/lib/useS3Sqlite";

const logger = getLogger("handle:upsertArticle", __filename);

const dbLockRedisKey = "blog:lock:articles-db";

type ArticlePayload = Omit<Article, "serial" | "slug" | "writer"> & {
  serial?: number;
};

export const handle: APIGatewayProxyHandler = handleApi({
  logger,
  handle: async (event) => {
    const slug = encodedId(
      (event.pathParameters ?? {}).slug! ?? throwError(404)
    );
    const article = {
      ...(JSON.parse(event.body ?? "{}") as ArticlePayload),
      slug,
    };
    logger.debug({ slug, article }, "Article to upsert");
    if (!validateArticle(article, { withoutSerial: true })) {
      throw new ApiError(404);
    }

    const writer = readWriter(event);
    const { inLock } = useRedisLock(secrets.redis);
    const { withDb } = useS3Sqlite(getPrivateS3cb());
    await inLock(withDb, {
      lockRedisKey: dbLockRedisKey,
    })({
      dbId: secrets.dbKey,
      createTableQuery: createTables,
      autoCommit: true,
      doIn: ({ db }) => {
        if (article.serial !== undefined && article.serial > 0) {
          updateArticle({
            db,
            article: {
              ...article,
              tags: trimTags(article.tags),
              serial: article.serial,
              writer: writer.name,
            },
          });
        } else {
          insertArticle({
            db,
            article: {
              ...article,
              tags: trimTags(article.tags),
              writer: writer.name,
            },
          });
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
