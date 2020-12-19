import * as BetterSqlite3 from "better-sqlite3";

import Article from "./entity/Article";

const DeleteArticleSQL = `DELETE FROM article
WHERE slug = @slug
;
`;

export default function deleteArticle({
  db,
  article: { slug },
}: {
  db: BetterSqlite3.Database;
  article: Pick<Article, "slug">;
}): BetterSqlite3.RunResult {
  return db.prepare(DeleteArticleSQL).run({ slug });
}
