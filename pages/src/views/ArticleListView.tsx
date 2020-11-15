import * as React from "react";

import Article from "../models/article/Article";
import ArticleListItem from "../components/ArticleListItem";
import { Link } from "react-router-dom";

export default function ArticleListView({ articles }: { articles: Article[] }) {
  return (
    <div className="ArticleList">
      <Link to="/article/new">Write new</Link>
      {articles.map((article) => (
        <ArticleListItem article={article} />
      ))}
    </div>
  );
}
