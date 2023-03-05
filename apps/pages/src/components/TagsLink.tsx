import * as React from "react";

import { Link } from "react-router-dom";
import styled from "styled-components";

const ArticleTagsDiv = styled.div`
  font-size: 0.8rem;
`;

export default function TagsLink({ tags }: { tags: string }) {
  return (
    <ArticleTagsDiv>
      {(tags ?? "")
        .trim()
        .split(/,/g)
        .filter(Boolean)
        .map((tag) => (
          <React.Fragment key={tag}>
            <Link className="ArticleTag" to={`/tag/${tag}`}>
              #{tag}
            </Link>{" "}
          </React.Fragment>
        ))}
    </ArticleTagsDiv>
  );
}
