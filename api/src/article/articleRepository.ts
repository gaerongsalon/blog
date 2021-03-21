import Article from "../db/entity/Article";
import ArticleDocument from "../db/entity/ArticleDocument";
import ArticleMeta from "../db/entity/ArticleMeta";
import SqliteDatabase from "../../libs/sqlite/SqliteDatabase";
import createTables from "../db/createTables";
import getAllArticleSlugs from "../db/getAllArticleSlugs";
import getArticle from "../db/getArticle";
import getArticles from "../db/getArticles";
import getArticlesByCategory from "../db/getArticlesByCategory";
import getArticlesByTag from "../db/getArticlesByTag";
import getNearArticles from "../db/getNearArticles";
import getPrivateS3cb from "../support/getPrivateS3cb";
import secrets from "@config/secrets.json";
import useS3Sqlite from "@libs/sqlite/useS3Sqlite";

export class NoArticleError {
  constructor(public readonly slug: string) {}
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function articleRepository() {
  async function useDb<T>(delegate: (db: SqliteDatabase) => T): Promise<T> {
    const { withDb } = useS3Sqlite(getPrivateS3cb());
    return withDb({
      dbId: secrets.dbKey,
      createTableQuery: createTables,
      doIn: ({ db }) => delegate(db),
    });
  }

  async function fetchArticles({
    offset,
    limit,
  }: {
    offset: number;
    limit: number;
  }): Promise<Article[]> {
    return useDb((db) => getArticles({ db, offset, limit }));
  }

  async function fetchArticlesByCategory({
    category,
  }: {
    category: string;
  }): Promise<Article[]> {
    return useDb((db) => getArticlesByCategory({ db, category }));
  }

  async function fetchArticlesByTag({
    tag,
  }: {
    tag: string;
  }): Promise<Article[]> {
    return useDb((db) => getArticlesByTag({ db, tag }));
  }

  function findRecommendArticles({
    db,
    article: { slug, category },
    count = 3,
  }: {
    db: SqliteDatabase;
    article: Article;
    // category: string;
    count?: number;
  }): ArticleMeta[] {
    const candidates = [
      ...(category ? getArticlesByCategory({ db, category }) : []),
      ...getNearArticles({ db, slug, around: Math.ceil(count / 2) }),
    ];
    const result: ArticleMeta[] = [];
    for (const candidate of candidates) {
      if (result.some((a) => a.serial === candidate.serial)) {
        continue;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content, ...meta } = candidate;
      result.push(meta);
    }
    return result
      .filter((a) => a.slug !== slug)
      .sort((a, b) =>
        a.category === category && b.category !== category
          ? -1
          : a.category !== category && b.category === category
          ? 1
          : b.written.localeCompare(a.written)
      )
      .slice(0, count);
  }

  function findArticleOrNull({
    db,
    slug,
  }: {
    db: SqliteDatabase;
    slug: string;
  }): Article | null {
    return getArticle({ db, slug }) ?? null;
  }

  async function fetchArticleDocument({
    slug,
  }: {
    slug: string;
  }): Promise<ArticleDocument> {
    return await useDb((db) => {
      const article = findArticleOrNull({ db, slug });
      if (!article) {
        throw new NoArticleError(slug);
      }
      return {
        article: article,
        recommendations: findRecommendArticles({ db, article }),
      };
    });
  }

  async function fetchAllArticleSlugs() {
    return useDb((db) => getAllArticleSlugs({ db }));
  }

  return {
    fetchArticles,
    fetchArticlesByCategory,
    fetchArticlesByTag,
    fetchArticleDocument,
    fetchAllArticleSlugs,
  };
}
