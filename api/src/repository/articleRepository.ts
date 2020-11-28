import Article from "../db/article";
import cacheOr from "../support/cacheOr";
import createTables from "../db/createTables";
import getArticle from "../db/getArticle";
import getArticles from "../db/getArticles";
import getPrivateS3cb from "../support/getPrivateS3cb";
import secrets from "../env/secrets";
import useS3Sqlite from "../sqlite/useS3Sqlite";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function articleRepository() {
  async function fetchArticles({
    offset,
    limit,
  }: {
    offset: number;
    limit: number;
  }): Promise<Article[]> {
    const { withDb } = useS3Sqlite(getPrivateS3cb());
    return withDb({
      dbId: secrets.dbKey,
      createTableQuery: createTables,
      doIn: ({ db }) => {
        return getArticles({ db, offset, limit });
      },
    });
  }

  async function cacheOrFetchArticles({
    offset,
    limit,
  }: Parameters<typeof fetchArticles>[0]): Promise<Article[]> {
    return cacheOr({
      cacheKey: `articles/${offset}/${limit}`,
      compute: async () => await fetchArticles({ offset, limit }),
    });
  }

  async function fetchArticle({ slug }: { slug: string }): Promise<Article> {
    const { withDb } = useS3Sqlite(getPrivateS3cb());
    return withDb({
      dbId: secrets.dbKey,
      createTableQuery: createTables,
      doIn: ({ db }) => getArticle({ db, slug }),
    });
  }

  async function cacheOrFetchArticle({
    slug,
  }: Parameters<typeof fetchArticle>[0]): Promise<Article> {
    return cacheOr({
      cacheKey: `article/${slug}`,
      compute: async () => await fetchArticle({ slug }),
    });
  }

  return {
    fetchArticles,
    cacheOrFetchArticles,
    fetchArticle,
    cacheOrFetchArticle,
  };
}
