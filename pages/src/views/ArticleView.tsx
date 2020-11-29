import * as React from "react";

import Article from "../models/article/Article";
import ArticleContent from "../components/ArticleContent";
import CategoryLink from "../components/CategoryLink";
import Hr from "../components/Hr";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import NavigationButtons from "../components/NavigationButtons";
import TagsLink from "../components/TagsLink";
import fetchArticle from "../apis/article/fetchArticle";
import formatWritten from "../utils/formatWritten";
import handleError from "../utils/handleError";
import hasWritePermission from "../apis/credential/hasWritePermission";
import metadata from "../metadata.json";
import styled from "styled-components";

const ArticleTitle = styled.h1`
  text-align: center;
  margin: 0.6rem 0;
  font-weight: 500;
  font-size: 1.75rem;
`;

const ArticleHeadImageDiv = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const ArticleHeadImage = styled.img`
  width: auto;
  max-width: 50vw;
`;

const ArticleWriter = styled.div``;

const ArticleWritten = styled.div`
  text-align: center;
  color: gray;
  font-size: 0.78rem;
  margin-bottom: 2rem;
`;

export default function ArticleView({ slug }: { slug: string }) {
  const [article, setArticle] = React.useState<Article | null>(null);
  React.useEffect(
    function () {
      fetchArticle({ slug }).then(setArticle).catch(handleError);
    },
    [slug]
  );
  if (!article) {
    return <Loading />;
  }
  const { writer, title, image, category, tags, written, content } = article;
  return (
    <div>
      <CategoryLink category={category} />
      <ArticleTitle>{title}</ArticleTitle>
      {!metadata.options?.hideWriter ? (
        <ArticleWriter>{writer}</ArticleWriter>
      ) : null}
      <ArticleWritten>{formatWritten(written)}</ArticleWritten>
      {image ? (
        <ArticleHeadImageDiv>
          <ArticleHeadImage src={image} alt={title} />
        </ArticleHeadImageDiv>
      ) : null}
      <ArticleContent content={content} />
      <TagsLink tags={tags} />
      <Hr />
      <NavigationButtons>
        {hasWritePermission() ? (
          <Link to={`/article/${slug}/edit`}>EDIT</Link>
        ) : null}
        <Link to={`/`}>HOME</Link>
      </NavigationButtons>
    </div>
  );
}
