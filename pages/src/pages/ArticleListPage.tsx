import * as React from "react";

import Article from "../models/article/Article";
import ArticleListItem from "../components/ArticleListItem";
import Loading from "../components/Loading";
import handleError from "../utils/handleError";
import listArticles from "../apis/article/listArticles";
import styled from "styled-components";

const ArticleListDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export default function ArticleListPage() {
  const [articles, setArticles] = React.useState<Article[] | null>(null);
  React.useEffect(function () {
    listArticles({}).then(setArticles).catch(handleError);
  }, []);
  return articles === null ? <Loading /> : <Articles articles={articles} />;
}

function Articles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return <div>No articles</div>;
  }
  const [first, ...remain] = articles;
  return (
    <>
      <ArticleListItem article={first} cols={1} />
      <ArticleListDiv>
        {remain.map((article) => (
          <ArticleListItem key={article.slug} article={article} cols={2} />
        ))}
      </ArticleListDiv>
    </>
  );
}
