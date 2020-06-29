import "source-map-support/register";

import { ApiError, handleApi } from "./base";

import { APIGatewayProxyHandler } from "aws-lambda";
import createTables from "../db/createTables";
import getAllTags from "../db/getAllTags";
import getArticle from "../db/getArticle";
import getArticles from "../db/getArticles";
import getCategories from "../db/getCategories";
import { logger } from "../logger/logger";
import useS3 from "../aws/useS3";
import useS3Sqlite from "../sqlite/useS3Sqlite";

const log = logger.get("handle:queryDatabase", __filename);

const dbKey = process.env.DB_KEY ?? "articles";

export const handle: APIGatewayProxyHandler = handleApi({
  log,
  handle: async (event) => {
    const { resource, id } = event.pathParameters ?? {};
    if (!resource || (resource === "article" && !id)) {
      throw new ApiError(404);
    }
    const { withDb } = useS3Sqlite(useS3());
    const data = await withDb({
      dbId: dbKey,
      createTableQuery: createTables,
      doIn: ({ db }) => {
        switch (resource) {
          case "articles":
            const { offset = "0", limit = "100" } =
              event.queryStringParameters ?? {};
            return getArticles({ db, offset, limit });
          case "categories":
            return getCategories({ db });
          case "tags":
            return getAllTags({ db });
          case "article":
            return getArticle({ db, slug: id });
        }
        return true;
      },
    });
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  },
  options: {
    accesslog: true,
  },
});
