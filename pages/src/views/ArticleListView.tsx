import * as React from "react";

import Article from "../models/article/Article";
import ArticleListItem from "../components/ArticleListItem";
import { Link } from "react-router-dom";
import styled from "styled-components";

const ArticleListDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export default function ArticleListView({ articles }: { articles: Article[] }) {
  return (
    <ArticleListDiv>
      <Link to="/article/new">Write new</Link>
      {articles.map((article) => (
        <ArticleListItem article={article} cols={1} />
      ))}
    </ArticleListDiv>
  );
}
