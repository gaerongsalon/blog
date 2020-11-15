import * as React from "react";

import Article from "../models/article/Article";
import ArticleListItem from "../components/ArticleListItem";
import { Link } from "react-router-dom";
import handleError from "../utils/handleError";
import hasWritePermission from "../apis/credential/hasWritePermission";
import listArticles from "../apis/listArticles";

export default function ArticleListPage() {
  const [articles, setArticles] = React.useState<Article[] | null>(null);
  React.useEffect(function () {
    listArticles({}).then(setArticles).catch(handleError);
  }, []);
  return (
    <>
      {hasWritePermission() ? (
        <Link className="NewArticle" to="/article/new">
          ✏️
        </Link>
      ) : null}
      <Articles articles={articles} />
    </>
  );
}

function Articles({ articles }: { articles: Article[] | null }) {
  if (articles === null) {
    return <div></div>;
  }
  if (articles.length === 0) {
    return <div>No articles</div>;
  }
  const [first, ...remain] = articles;
  return (
    <>
      <ArticleListItem article={first} className="FirstArticleItem" />
      <div className="ArticleList">
        {remain.map((article) => (
          <ArticleListItem
            key={article.slug}
            article={article}
            className="SubArticleItem"
          />
        ))}
      </div>
    </>
  );
}
