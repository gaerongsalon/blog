import SqliteDatabase from "@blog/sqlite/lib/SqliteDatabase";

const GetTagsSQL = `SELECT DISTINCT tags FROM article`;

export default function getAllTags({ db }: { db: SqliteDatabase }): string[] {
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
