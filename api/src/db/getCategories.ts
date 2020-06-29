import * as BetterSqlite3 from "better-sqlite3";

const GetCategoriesSQL = `SELECT DISTINCT category FROM article`;

export default function getCategories({
  db,
}: {
  db: BetterSqlite3.Database;
}): string[] {
  return (db.prepare(GetCategoriesSQL).all() as { category: string }[]).map(
    ({ category }) => category
  );
}
