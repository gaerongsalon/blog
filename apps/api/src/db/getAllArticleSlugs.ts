import ArticleMeta from "./entity/ArticleMeta";
import SqliteDatabase from "@blog/sqlite/lib/SqliteDatabase";

const GetAllArticleSlugsSQL = `SELECT slug, title FROM article ORDER BY written DESC`;

export type ArticleSlugAndTitle = Pick<ArticleMeta, "slug" | "title">;

export default function getAllArticleSlugs({
  db,
}: {
  db: SqliteDatabase;
}): ArticleSlugAndTitle[] {
  return (
    (db.prepare(GetAllArticleSlugsSQL).all() as ArticleSlugAndTitle[]) ?? []
  );
}
