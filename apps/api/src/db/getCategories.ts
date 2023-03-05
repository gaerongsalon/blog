import SqliteDatabase from "@blog/sqlite/lib/SqliteDatabase";

const GetCategoriesSQL = `SELECT DISTINCT category FROM article`;

export default function getCategories({
  db,
}: {
  db: SqliteDatabase;
}): string[] {
  return (db.prepare(GetCategoriesSQL).all() as { category: string }[]).map(
    ({ category }) => category
  );
}
