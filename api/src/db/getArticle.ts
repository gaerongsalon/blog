import * as BetterSqlite3 from "better-sqlite3";

import Article from "./entity/Article";

const GetArticleSQL = `SELECT * FROM article WHERE slug = @slug`;

export default function getArticle({
  db,
  slug,
}: {
  db: BetterSqlite3.Database;
  slug: string;
}): Article {
  return db.prepare(GetArticleSQL).get({ slug }) as Article;
}
