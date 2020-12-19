import * as React from "react";

import Article from "../models/article/Article";
import ArticleListView from "../views/ArticleListView";
import Loading from "../components/Loading";
import handleError from "../utils/handleError";
import listArticlesByTag from "../apis/article/listArticlesByTag";
import { useParams } from "react-router-dom";

export default function CategoryPage() {
  let { tag } = useParams<{ tag: string }>();
  const [articles, setArticles] = React.useState<Article[] | null>(null);
  React.useEffect(
    function () {
      listArticlesByTag({ tag })
        .then((articles) => {
          setArticles(articles);
        })
        .catch(handleError);
    },
    [tag]
  );
  return articles === null ? (
    <Loading />
  ) : (
    <ArticleListView articles={articles} />
  );
}
