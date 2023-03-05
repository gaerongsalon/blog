import Article from "./entity/Article";
import SqliteDatabase from "@blog/sqlite/lib/SqliteDatabase";

const GetArticleSQL = `SELECT * FROM article WHERE slug = @slug COLLATE NOCASE`;

export default function getArticle({
  db,
  slug,
}: {
  db: SqliteDatabase;
  slug: string;
}): Article {
  return db.prepare(GetArticleSQL).get({ slug }) as Article;
}
