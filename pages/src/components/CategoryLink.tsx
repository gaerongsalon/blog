import * as React from "react";

import { Link } from "react-router-dom";

export default function CategoryLink({ category }: { category: string }) {
  return (
    <div className="ArticleCategory">
      <Link to={`/category/${category}`}>{category}</Link>
    </div>
  );
}
