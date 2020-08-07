import * as BetterSqlite3 from "better-sqlite3";

import Article, { articlePropertyKeys } from "./article";

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
  db: BetterSqlite3.Database;
  article: Omit<Article, "serial">;
}): BetterSqlite3.RunResult {
  return db.prepare(InsertArticleSQL).run({ ...article });
}
