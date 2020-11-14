import * as React from "react";

import Article from "../models/article/Article";
import ArticleListItem from "../components/ArticleListItem";
import { Link } from "react-router-dom";
import handleError from "../utils/handleError";
import hasWritePermission from "../apis/credential/hasWritePermission";
import listArticles from "../apis/listArticles";

export default function ArticleListPage() {
  const [articles, setArticles] = React.useState<Article[]>([]);
  React.useEffect(function () {
    listArticles({}).then(setArticles).catch(handleError);
  }, []);
  return (
    <div>
      {hasWritePermission() ? <Link to="/article/new">Write new</Link> : null}
      {articles.map((article) => (
        <ArticleListItem key={article.slug} article={article} />
      ))}
      {articles.length === 0 ? <div>No articles</div> : null}
    </div>
  );
}
