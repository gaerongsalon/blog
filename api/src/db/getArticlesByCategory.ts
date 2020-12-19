import * as BetterSqlite3 from "better-sqlite3";

import Article from "./entity/Article";

const GetArticleByCategorySQL = `SELECT * FROM article WHERE category = @category ORDER BY written DESC`;

export default function getArticlesByCategory({
  db,
  category,
}: {
  db: BetterSqlite3.Database;
  category: string;
}): Article[] {
  return (
    (db.prepare(GetArticleByCategorySQL).all({ category }) as Article[]) ?? []
  );
}
