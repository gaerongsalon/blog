import * as React from "react";

import Article from "../models/article/Article";
import ArticleListItem from "../components/ArticleListItem";
import styled from "styled-components";

const ArticleListDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export default function ArticleListView({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return <div>No articles</div>;
  }
  return (
    <ArticleListDiv>
      {articles.map((article) => (
        <ArticleListItem key={article.slug} article={article} cols={2} />
      ))}
    </ArticleListDiv>
  );
}
