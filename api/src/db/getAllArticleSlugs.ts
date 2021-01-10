import * as BetterSqlite3 from "better-sqlite3";

import ArticleMeta from "./entity/ArticleMeta";

const GetAllArticleSlugsSQL = `SELECT slug, title FROM article ORDER BY written DESC`;

export type ArticleSlugAndTitle = Pick<ArticleMeta, "slug" | "title">;

export default function getAllArticleSlugs({
  db,
}: {
  db: BetterSqlite3.Database;
}): ArticleSlugAndTitle[] {
  return (
    (db.prepare(GetAllArticleSlugsSQL).all() as ArticleSlugAndTitle[]) ?? []
  );
}
