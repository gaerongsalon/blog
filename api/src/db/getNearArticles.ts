import * as BetterSqlite3 from "better-sqlite3";

import Article from "./entity/Article";

const GetNearArticlesSQL = `WITH rankNoView AS (
  SELECT RANK() OVER (ORDER BY written DESC) AS rankNo
       , *
  FROM article
),
myRankNoView AS (
  SELECT rankNo AS myRankNo
  FROM rankNoView
  WHERE slug = @slug
)
SELECT *
FROM rankNoView r
  JOIN myRankNoView m ON r.rankNo BETWEEN m.myRankNo - @around AND m.myRankNo + @around
ORDER BY rankNo`;

export default function getNearArticles({
  db,
  slug,
  around,
}: {
  db: BetterSqlite3.Database;
  slug: string;
  around: number;
}): Article[] {
  return (
    (db.prepare(GetNearArticlesSQL).all({ slug, around }) as Article[]) ?? []
  );
}
