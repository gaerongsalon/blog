import * as React from "react";

import Article from "../models/article/Article";
import ArticleContent from "../components/ArticleContent";
import { Link } from "react-router-dom";
import fetchArticle from "../apis/fetchArticle";
import handleError from "../utils/handleError";
import hasWritePermission from "../apis/credential/hasWritePermission";

export default function ArticleView({ slug }: { slug: string }) {
  const [article, setArticle] = React.useState<Article | null>(null);
  React.useEffect(
    function () {
      fetchArticle({ slug }).then(setArticle).catch(handleError);
    },
    [slug]
  );
  if (!article) {
    return <div>Loading...</div>;
  }
  const { writer, title, image, category, tags, written, content } = article;
  return (
    <div>
      <div>{writer}</div>
      <div>{title}</div>
      <div>{image}</div>
      <div>{category}</div>
      <div>{tags}</div>
      <div>{written}</div>
      <ArticleContent content={content} />
      {hasWritePermission() ? (
        <div>
          <Link to={`/article/${slug}/edit`}>Go to Edit</Link>
        </div>
      ) : null}
      <div>
        <Link to={`/articles`}>Go to List</Link>
      </div>
      <div>
        <Link to={`/`}>Go to Home</Link>
      </div>
    </div>
  );
}
