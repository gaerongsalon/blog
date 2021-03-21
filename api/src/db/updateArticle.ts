import Article, { articlePropertyKeys } from "./entity/Article";

import RunResult from "@libs/sqlite/RunResult";
import SqliteDatabase from "@libs/sqlite/SqliteDatabase";

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
