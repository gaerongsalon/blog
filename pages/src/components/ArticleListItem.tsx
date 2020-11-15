import * as React from "react";

import Article from "../models/article/Article";
import { Link } from "react-router-dom";

export default function ArticleListItem({
  article: { slug, title, image, excerpt, written },
}: {
  article: Article;
}) {
  return (
    <div>
      <Link to={`/article/${slug}`}>
        {title}
        {image ? <img src={image} alt={title} /> : null}
      </Link>
      <div>{excerpt}</div>
      <div>{written}</div>
    </div>
  );
}
