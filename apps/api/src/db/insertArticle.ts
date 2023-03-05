import Article, { articlePropertyKeys } from "./entity/Article";

import RunResult from "@blog/sqlite/lib/RunResult";
import SqliteDatabase from "@blog/sqlite/lib/SqliteDatabase";

const InsertArticleSQL = `INSERT INTO article
  (${articlePropertyKeys.filter((p) => p !== "serial").join(",")})
VALUES
  (${articlePropertyKeys
    .filter((p) => p !== "serial")
    .map((p) => `@${p}`)
    .join(",")})
;
`;

export default function insertArticle({
  db,
  article,
}: {
  db: SqliteDatabase;
  article: Omit<Article, "serial">;
}): RunResult {
  return db.prepare(InsertArticleSQL).run({ ...article });
}
