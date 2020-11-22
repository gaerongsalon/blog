import Article from "../../db/article";
import cacheOr from "../../support/cacheOr";
import createTables from "../../db/createTables";
import getArticles from "../../db/getArticles";
import getPrivateS3cb from "../../support/getPrivateS3cb";
import secrets from "../../env/secrets";
import useS3Sqlite from "../../sqlite/useS3Sqlite";

export default async function queryArticles({
  queryParams,
}: {
  queryParams: { [key: string]: string };
}): Promise<Article[]> {
  const { offset = "0", limit = "100" } = queryParams ?? {};
  return cacheOr({
    cacheKey: `articles/${offset}/${limit}`,
    compute: async () => {
      const { withDb } = useS3Sqlite(getPrivateS3cb());
      return withDb({
        dbId: secrets.dbKey,
        createTableQuery: createTables,
        doIn: ({ db }) => {
          return getArticles({ db, offset, limit });
        },
      });
    },
  });
}
