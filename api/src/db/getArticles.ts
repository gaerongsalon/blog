import * as BetterSqlite3 from "better-sqlite3";

import Article from "./entity/Article";

const GetArticlesSQL = `SELECT * FROM article ORDER BY written DESC LIMIT @limit OFFSET @offset`;

export default function getArticles({
  db,
  limit,
  offset,
}: {
  db: BetterSqlite3.Database;
  limit: string | number;
  offset: string | number;
}): Article[] {
  return (db.prepare(GetArticlesSQL).all({ limit, offset }) as Article[]) ?? [];
}
