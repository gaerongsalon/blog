import Article, { articlePropertyKeys } from "./entity/Article";

import RunResult from "@blog/sqlite/lib/RunResult";
import SqliteDatabase from "@blog/sqlite/lib/SqliteDatabase";

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
  db: SqliteDatabase;
  article: Article;
}): RunResult {
  return db.prepare(UpdateArticleSQL).run({ ...article });
}
