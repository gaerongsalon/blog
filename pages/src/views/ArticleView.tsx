import * as React from "react";

import ArticleDocument from "../models/article/ArticleDocument";
import ArticleHelmet from "../components/ArticleHelmet";
import CategoryLink from "../components/CategoryLink";
import Hr from "../components/Hr";
import { Link } from "react-router-dom";
import NavigationButtons from "../components/NavigationButtons";
import Recommendations from "../components/Recommendations";
import TagsLink from "../components/TagsLink";
import buildImageCdnUrl from "../utils/buildImageCdnUrl";
import formatWritten from "../utils/formatWritten";
import hasWritePermission from "../apis/credential/hasWritePermission";
import metadata from "../metadata.json";
import scroll from "../utils/scroll";
import styled from "styled-components";
import syntaxOn from "../utils/syntaxOn";

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
  max-height: 50vh;
  @media (max-width: 800px) {
    max-width: 100%;
  }
`;

const ArticleWriter = styled.div``;

const ArticleWritten = styled.div`
  text-align: center;
  color: gray;
  font-size: 0.78rem;
  margin-bottom: 2rem;
`;

export default function ArticleView({
  document: { article, recommendations },
}: {
  document: ArticleDocument;
}) {
  const {
    slug,
    writer,
    title,
    image,
    category,
    tags,
    written,
    content,
  } = article;
  const hasCode = content.includes("<pre");
  React.useEffect(
    function () {
      return hasCode ? syntaxOn() : () => 0;
    },
    [hasCode]
  );
  return (
    <div>
      <ArticleHelmet article={article} />
      <CategoryLink category={category} />
      <ArticleTitle>{title}</ArticleTitle>
      {!metadata.options?.hideWriter ? (
        <ArticleWriter>{writer}</ArticleWriter>
      ) : null}
      <ArticleWritten>{formatWritten(written)}</ArticleWritten>
      {image ? (
        <ArticleHeadImageDiv>
          <ArticleHeadImage
            src={buildImageCdnUrl(image)}
            alt={title}
            loading="lazy"
          />
        </ArticleHeadImageDiv>
      ) : null}
      <div
        className="ql-editor"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <TagsLink tags={tags} />
      <Hr />
      <Recommendations recommendations={recommendations} />
      <NavigationButtons>
        {hasWritePermission() ? (
          <Link to={`/article/${slug}/edit`}>EDIT</Link>
        ) : null}
        <Link to="/" onClick={() => scroll({ key: "articles" }).reset()}>
          HOME
        </Link>
      </NavigationButtons>
    </div>
  );
}
