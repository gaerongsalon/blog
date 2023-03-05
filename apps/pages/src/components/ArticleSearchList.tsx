import * as React from "react";

import { Link, useNavigate } from "react-router-dom";

import ArticleSearch from "../models/article/ArticleSearch";
import NavigationButtons from "./NavigationButtons";

const almostSameDistance = 24;

export default function ArticleSearchList({
  search,
}: {
  search: ArticleSearch[];
}) {
  const navigate = useNavigate();
  const redirectable = search[0].distance <= almostSameDistance;
  React.useEffect(
    function () {
      if (redirectable) {
        navigate(`/article/${search[0].slug}`, { replace: true });
      }
    },
    [redirectable, search]
  );
  if (redirectable) {
    return <div></div>;
  }
  return (
    <div>
      <h1>Page not found :(</h1>
      <h2>But how about this?</h2>
      <ul>
        {search.map((each) => (
          <li key={each.slug}>
            <Link to={`/article/${each.slug}`}>{each.title}</Link>
          </li>
        ))}
      </ul>
      <NavigationButtons>
        <Link to="/">HOME</Link>
      </NavigationButtons>
    </div>
  );
}
