import * as React from "react";

import Article from "../models/article/Article";
import ArticleEditView from "../views/ArticleEditView";
import fetchArticle from "../apis/fetchArticle";
import handleError from "../utils/handleError";
import { useParams } from "react-router-dom";

export default function ArticleEditPage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = React.useState<Article | null>(null);
  React.useEffect(
    function () {
      if (slug) {
        fetchArticle({ slug }).then(setArticle).catch(handleError);
      }
    },
    [slug]
  );
  if (!article) {
    return <div>Loading...</div>;
  }
  return <ArticleEditView mode="edit" article={article} />;
}
