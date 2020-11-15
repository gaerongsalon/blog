import * as React from "react";

import Article from "../models/article/Article";
import { Link } from "react-router-dom";
import formatWritten from "../utils/formatWritten";

export default function ArticleListItem({
  article: { slug, title, image, excerpt, written },
  className,
}: {
  article: Article;
  className?: string;
}) {
  return (
    <div className={`ArticleItem ${className ?? ""}`}>
      <Link to={`/article/${slug}`}>
        <h2 className="ArticleTitle">{title}</h2>
        {image ? (
          <div className="ArticleHeadImage">
            <img src={image} alt={title} />
          </div>
        ) : null}
      </Link>
      <div className="ArticleExcerpt">{excerpt}</div>
      <div className="ArticleWritten">{formatWritten(written)}</div>
    </div>
  );
}
