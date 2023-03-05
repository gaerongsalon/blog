import Article from "./entity/Article";
import SqliteDatabase from "@blog/sqlite/lib/SqliteDatabase";

const GetArticleByCategorySQL = `SELECT * FROM article WHERE category = @category ORDER BY written DESC`;

export default function getArticlesByCategory({
  db,
  category,
}: {
  db: SqliteDatabase;
  category: string;
}): Article[] {
  return (
    (db.prepare(GetArticleByCategorySQL).all({ category }) as Article[]) ?? []
  );
}
