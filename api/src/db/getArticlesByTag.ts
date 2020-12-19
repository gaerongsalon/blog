import * as BetterSqlite3 from "better-sqlite3";

import Article from "./entity/Article";

const GetArticleByTagSQL = `SELECT * FROM article WHERE INSTR(tags, @tag) > 0 ORDER BY written DESC`;

export default function getArticlesByTag({
  db,
  tag,
}: {
  db: BetterSqlite3.Database;
  tag: string;
}): Article[] {
  return (db.prepare(GetArticleByTagSQL).all({ tag }) as Article[]) ?? [];
}
