import Article from "../../db/article";
import cacheOr from "../../support/cacheOr";
import createTables from "../../db/createTables";
import getArticle from "../../db/getArticle";
import getPrivateS3cb from "../../support/getPrivateS3cb";
import secrets from "../../env/secrets";
import useS3Sqlite from "../../sqlite/useS3Sqlite";

export default async function queryArticle({
  slug,
}: {
  slug: string;
}): Promise<Article> {
  return cacheOr({
    cacheKey: `article/${slug}`,
    compute: async () => {
      const { withDb } = useS3Sqlite(getPrivateS3cb());
      return withDb({
        dbId: secrets.dbKey,
        createTableQuery: createTables,
        doIn: ({ db }) => getArticle({ db, slug }),
      });
    },
  });
}
