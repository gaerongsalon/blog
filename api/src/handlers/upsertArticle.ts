import "source-map-support/register";

import { ApiError, handleApi, throwError } from "./base";
import Article, { validateArticle } from "../db/article";

import { APIGatewayProxyHandler } from "aws-lambda";
import createTables from "../db/createTables";
import encodeSlug from "../utils/encodeSlug";
import { getLogger } from "@yingyeothon/slack-logger";
import insertArticle from "../db/insertArticle";
import readWriter from "./authorization/readWriter";
import secrets from "../env/secrets";
import updateArticle from "../db/updateArticle";
import useRedisLock from "../redis/useRedisLock";
import useS3 from "../aws/useS3";
import useS3Sqlite from "../sqlite/useS3Sqlite";

const logger = getLogger("handle:upsertArticle", __filename);

const dbLockRedisKey = "blog:lock:articles-db";

type ArticlePayload = Omit<Article, "serial" | "slug" | "writer"> & {
  serial?: number;
};

export const handle: APIGatewayProxyHandler = handleApi({
  logger,
  handle: async (event) => {
    const slug = encodeSlug(
      (event.pathParameters ?? {}).slug ?? throwError(404)
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
    const { inLock } = useRedisLock();
    const { withDb } = useS3Sqlite(useS3());
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
              serial: article.serial,
              writer: writer.name,
            },
          });
        } else {
          insertArticle({
            db,
            article: {
              ...article,
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
