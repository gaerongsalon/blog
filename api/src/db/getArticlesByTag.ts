import Article from "./entity/Article";
import SqliteDatabase from "@libs/sqlite/SqliteDatabase";

const GetArticleByTagSQL = `SELECT * FROM article WHERE INSTR(tags, @tag) > 0 ORDER BY written DESC`;

export default function getArticlesByTag({
  db,
  tag,
}: {
  db: SqliteDatabase;
  tag: string;
}): Article[] {
  return (db.prepare(GetArticleByTagSQL).all({ tag }) as Article[]) ?? [];
}
