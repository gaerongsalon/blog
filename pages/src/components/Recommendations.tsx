import * as React from "react";

import ArticleMeta from "../models/article/ArticleMeta";
import Hr from "./Hr";
import { Link } from "react-router-dom";
import formatWritten from "../utils/formatWritten";
import styled from "styled-components";

const ContainerDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const ItemDiv = styled.div`
  padding: 0 1rem;
  width: 33%;
  @media (max-width: 1024px) {
    margin-bottom: 2rem;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const ArticleTitle = styled.div`
  font-weight: normal;
  text-align: center;
  font-size: 1.1rem;
  color: #444444;
  margin: 0.4vh auto;
  word-break: keep-all;
`;

const ArticleWrittenDiv = styled.div`
  text-align: center;
  color: gray;
  font-size: 0.78rem;
`;

export default function Recommendations({
  recommendations,
}: {
  recommendations: ArticleMeta[];
}) {
  if (recommendations.length === 0) {
    return <></>;
  }
  return (
    <>
      <ContainerDiv>
        {recommendations.map(({ slug, title, written }) => (
          <ItemDiv key={slug}>
            <Link to={`/article/${slug}`}>
              <ArticleTitle>{title}</ArticleTitle>
              <ArticleWrittenDiv>{formatWritten(written)}</ArticleWrittenDiv>
            </Link>
          </ItemDiv>
        ))}
      </ContainerDiv>
      <Hr />
    </>
  );
}
