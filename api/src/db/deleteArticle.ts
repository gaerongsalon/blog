import Article from "./entity/Article";
import RunResult from "@libs/sqlite/RunResult";
import SqliteDatabase from "@libs/sqlite/SqliteDatabase";

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
