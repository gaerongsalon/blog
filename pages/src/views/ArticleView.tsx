import * as React from "react";

import Article from "../models/article/Article";
import ArticleContent from "../components/ArticleContent";
import CategoryLink from "../components/CategoryLink";
import { Link } from "react-router-dom";
import TagsLink from "../components/TagsLink";
import fetchArticle from "../apis/fetchArticle";
import formatWritten from "../utils/formatWritten";
import handleError from "../utils/handleError";
import hasWritePermission from "../apis/credential/hasWritePermission";
import metadata from "../metadata.json";

export default function ArticleView({ slug }: { slug: string }) {
  const [article, setArticle] = React.useState<Article | null>(null);
  React.useEffect(
    function () {
      fetchArticle({ slug }).then(setArticle).catch(handleError);
    },
    [slug]
  );
  if (!article) {
    return <div className="Loading">Loading...</div>;
  }
  const { writer, title, image, category, tags, written, content } = article;
  return (
    <div className="Article">
      <h1 className="ArticleTitle">{title}</h1>
      {image ? (
        <div className="ArticleHeadImage">
          <img src={image} alt={title} />
        </div>
      ) : null}
      {!metadata.options?.hideWriter ? (
        <div className="ArticleWriter">{writer}</div>
      ) : null}
      <div className="ArticleWritten">{formatWritten(written)}</div>
      <CategoryLink category={category} />
      <ArticleContent content={content} />
      <TagsLink tags={tags} />
      <hr />
      <div className="NavigationButtons">
        {hasWritePermission() ? (
          <div className="GotoEdit">
            <Link to={`/article/${slug}/edit`}>Go to Edit</Link>
          </div>
        ) : null}
        <div className="GotoHome">
          <Link to={`/`}>Go to Home</Link>
        </div>
      </div>
    </div>
  );
}
