import * as BetterSqlite3 from "better-sqlite3";

const GetAllArticleSlugsSQL = `SELECT slug FROM article ORDER BY written DESC`;

export default function getAllArticleSlugs({
  db,
}: {
  db: BetterSqlite3.Database;
}): { slug: string }[] {
  return (db.prepare(GetAllArticleSlugsSQL).all() as { slug: string }[]) ?? [];
}
