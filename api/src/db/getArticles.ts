import Article from "./entity/Article";
import SqliteDatabase from "@libs/sqlite/SqliteDatabase";

const GetArticlesSQL = `SELECT * FROM article ORDER BY written DESC LIMIT @limit OFFSET @offset`;

export default function getArticles({
  db,
  limit,
  offset,
}: {
  db: SqliteDatabase;
  limit: string | number;
  offset: string | number;
}): Article[] {
  return (db.prepare(GetArticlesSQL).all({ limit, offset }) as Article[]) ?? [];
}
