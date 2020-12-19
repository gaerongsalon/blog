import * as BetterSqlite3 from "better-sqlite3";

const GetTagsSQL = `SELECT DISTINCT tags FROM article`;

export default function getAllTags({
  db,
}: {
  db: BetterSqlite3.Database;
}): string[] {
  return [
    ...new Set(
      (db.prepare(GetTagsSQL).all() as { tags: string }[])
        .map(({ tags }) => (tags ?? "").trim().split(/\s+/g))
        .reduce((a, b) => a.concat(b), [])
    ),
  ]
    .sort((a, b) => a.localeCompare(b))
    .filter(Boolean);
}
