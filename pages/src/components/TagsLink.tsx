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
        .split(/\s+/g)
        .filter(Boolean)
        .map((tag) => (
          <Link key={tag} className="ArticleTag" to={`/tag/${tag}`}>
            #{tag}
          </Link>
        ))}
    </ArticleTagsDiv>
  );
}
