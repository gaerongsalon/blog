import * as React from "react";

import Article from "../models/article/Article";
import ArticleListView from "../views/ArticleListView";
import Loading from "../components/Loading";
import handleError from "../utils/handleError";
import listArticlesByCategory from "../apis/article/listArticlesByCategory";
import { useParams } from "react-router-dom";

export default function CategoryPage() {
  let { category } = useParams<{ category: string }>();
  const [articles, setArticles] = React.useState<Article[] | null>(null);
  React.useEffect(
    function () {
      listArticlesByCategory({ category })
        .then((articles) => {
          setArticles(articles);
        })
        .catch(handleError);
    },
    [category]
  );
  return articles === null ? (
    <Loading />
  ) : (
    <>
      <ArticleListView articles={articles} />
    </>
  );
}
