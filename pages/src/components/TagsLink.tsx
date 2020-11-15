import * as React from "react";

import { Link } from "react-router-dom";

export default function TagsLink({ tags }: { tags: string }) {
  return (
    <div className="ArticleTags">
      {(tags ?? "")
        .trim()
        .split(/\s+/g)
        .filter(Boolean)
        .map((tag) => (
          <Link key={tag} className="ArticleTag" to={`/tag/${tag}`}>
            #{tag}
          </Link>
        ))}
    </div>
  );
}
