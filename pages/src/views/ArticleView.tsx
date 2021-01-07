import * as React from "react";

import ArticleDocument from "../models/article/ArticleDocument";
import ArticleHelmet from "../components/ArticleHelmet";
import CategoryLink from "../components/CategoryLink";
import Hr from "../components/Hr";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import NavigationButtons from "../components/NavigationButtons";
import PageNotFoundPage from "../pages/PageNotFoundPage";
import Recommendations from "../components/Recommendations";
import TagsLink from "../components/TagsLink";
import fetchArticle from "../apis/article/fetchArticle";
import formatWritten from "../utils/formatWritten";
import handleError from "../utils/handleError";
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

export default function ArticleView({ slug }: { slug: string }) {
  const [doc, setDoc] = React.useState<ArticleDocument | false | null>(null);
  React.useEffect(
    function () {
      fetchArticle({ slug })
        .then((doc) => {
          setDoc(doc);
          scroll({ key: "article" }).top();
          syntaxOn();
        })
        .catch((error) => {
          console.error(error);
          setDoc(false);
        });
    },
    [slug]
  );
  if (doc === null) {
    return <Loading />;
  }
  if (doc === false) {
    return <PageNotFoundPage />;
  }
  const { article, recommendations } = doc;
  const { writer, title, image, category, tags, written, content } = article;
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
          <ArticleHeadImage src={image} alt={title} />
        </ArticleHeadImageDiv>
      ) : null}
      {/* <ArticleContent content={content} /> */}
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
