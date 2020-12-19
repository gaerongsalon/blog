import * as BetterSqlite3 from "better-sqlite3";

import Article, { articlePropertyKeys } from "./entity/Article";

const UpdateArticleSQL = `UPDATE article
SET ${articlePropertyKeys
  .filter((p) => p !== "serial")
  .map((p) => `${p} = @${p}`)
  .join(",")}
WHERE
  serial = @serial
;
`;

export default function updateArticle({
  db,
  article,
}: {
  db: BetterSqlite3.Database;
  article: Article;
}): BetterSqlite3.RunResult {
  return db.prepare(UpdateArticleSQL).run({ ...article });
}
