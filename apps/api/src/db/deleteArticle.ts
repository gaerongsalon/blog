import Article from "./entity/Article";
import RunResult from "@blog/sqlite/lib/RunResult";
import SqliteDatabase from "@blog/sqlite/lib/SqliteDatabase";

const DeleteArticleSQL = `DELETE FROM article
WHERE slug = @slug
;
`;

export default function deleteArticle({
  db,
  article: { slug },
}: {
  db: SqliteDatabase;
  article: Pick<Article, "slug">;
}): RunResult {
  return db.prepare(DeleteArticleSQL).run({ slug });
}
