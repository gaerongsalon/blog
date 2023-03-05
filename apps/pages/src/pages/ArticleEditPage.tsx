import * as React from "react";

import Article from "../models/article/Article";
import ArticleEditView from "../views/ArticleEditView";
import fetchArticle from "../apis/article/fetchArticle";
import handleError from "../utils/handleError";
import hasWritePermission from "../apis/credential/hasWritePermission";
import { useParams } from "react-router-dom";

export default function ArticleEditPage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = React.useState<Article | null>(null);
  React.useEffect(
    function () {
      if (hasWritePermission() && slug) {
        fetchArticle({ slug })
          .then(({ article }) => setArticle(article))
          .catch(handleError);
      }
    },
    [slug]
  );
  if (!article) {
    return <div className="Loading">Loading...</div>;
  }
  return <ArticleEditView mode="edit" article={article} />;
}
