import * as React from "react";

import Article from "../models/article/Article";
import CategoryLink from "./CategoryLink";
import { Link } from "react-router-dom";
import formatWritten from "../utils/formatWritten";
import styled from "styled-components";

const OneInRowArticleItem = styled.div`
  margin-bottom: 2rem;
`;

const TwoInRowArticleItem = styled(OneInRowArticleItem)`
  width: calc(50% - 2rem);
  &:nth-child(odd) {
    padding-right: 2rem;
  }
  &:nth-child(even) {
    padding-left: 2rem;
  }
  @media (max-width: 800px) {
    width: 100%;
    &:nth-child(odd) {
      padding: 0;
    }
    &:nth-child(even) {
      padding: 0;
    }
  }
`;

const ArticleTitle = styled.div`
  font-weight: normal;
  text-align: center;
  font-size: 1.1rem;
  color: #444444;
  margin: 0.4vh auto;
`;

const ArticleHeadImageDiv = styled.div`
  text-align: center;
  margin-bottom: 0.7vh;
`;

const OneInRowArticleHeadImage = styled.img`
  max-width: 100%;
`;
const TwoInRowArticleHeadImage = styled(OneInRowArticleHeadImage)`
  max-height: 24vh;
`;

const ArticleWrittenDiv = styled.div`
  text-align: center;
  color: gray;
  font-size: 0.78rem;
`;

const ArticleExcerpt = styled.div`
  text-align: justify;
  font-size: 0.95rem;
  margin-top: 0.8rem;
`;

export default function ArticleListItem({
  article: { slug, title, image, category, excerpt, written },
  cols,
}: {
  article: Article;
  cols: 1 | 2;
}) {
  const ArticleItem = cols === 1 ? OneInRowArticleItem : TwoInRowArticleItem;
  const ArticleHeadImage =
    cols === 1 ? OneInRowArticleHeadImage : TwoInRowArticleHeadImage;
  const excerptMaxLength = Math.floor(150 / cols);
  return (
    <ArticleItem>
      {image ? (
        <Link to={`/article/${slug}`}>
          <ArticleHeadImageDiv>
            <ArticleHeadImage src={image} alt={title} />
          </ArticleHeadImageDiv>
        </Link>
      ) : null}
      <CategoryLink category={category} />
      <Link to={`/article/${slug}`}>
        <ArticleTitle>{title}</ArticleTitle>
      </Link>
      <ArticleWrittenDiv>{formatWritten(written)}</ArticleWrittenDiv>
      <ArticleExcerpt>
        {excerpt.length > excerptMaxLength
          ? `${excerpt.substring(0, excerptMaxLength)}...`
          : excerpt}
      </ArticleExcerpt>
    </ArticleItem>
  );
}
