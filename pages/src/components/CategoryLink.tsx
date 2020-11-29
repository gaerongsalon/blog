import * as React from "react";

import { Link } from "react-router-dom";
import styled from "styled-components";

const ArticleCategory = styled.div`
  text-align: center;
  color: #c39f76;
  font-size: 0.8rem;
`;

export default function CategoryLink({ category }: { category: string }) {
  return (
    <ArticleCategory>
      <Link to={`/category/${category}`}>{category}</Link>
    </ArticleCategory>
  );
}
