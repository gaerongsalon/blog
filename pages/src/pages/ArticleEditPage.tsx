import * as React from "react";

import { Redirect, useParams } from "react-router-dom";

import Article from "../models/article/Article";
import ArticleEditView from "../views/ArticleEditView";
import fetchArticle from "../apis/article/fetchArticle";
import handleError from "../utils/handleError";
import hasWritePermission from "../apis/credential/hasWritePermission";

export default function ArticleEditPage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = React.useState<Article | null>(null);
  React.useEffect(
    function () {
      if (hasWritePermission() && slug) {
        fetchArticle({ slug }).then(setArticle).catch(handleError);
      }
    },
    [slug]
  );
  if (!hasWritePermission()) {
    return <Redirect to="/" />;
  }
  if (!article) {
    return <div className="Loading">Loading...</div>;
  }
  return <ArticleEditView mode="edit" article={article} />;
}
