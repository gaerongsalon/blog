import * as BetterSqlite3 from "better-sqlite3";

import Article from "./article";

const UpsertScoreSQL = `INSERT INTO article
  (slug, writer, title, image, excerpt, category, tags, writeDate)
VALUES
  (@slug, @writer, @title, @image, @excerpt, @category, @tags, @writeDate)
ON CONFLICT(slug)
DO UPDATE SET
    title = excluded.title
  , image = excluded.image
  , excerpt = excluded.excerpt
  , category = excluded.category
  , tags = excluded.tags;
`;

export default function upsertArticle({
  db,
  article,
}: {
  db: BetterSqlite3.Database;
  article: Article;
}): BetterSqlite3.RunResult {
  return db.prepare(UpsertScoreSQL).run({ ...article });
}
