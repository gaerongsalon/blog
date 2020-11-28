import * as React from "react";

import ArticleListPage from "./ArticleListPage";

export default function FirstPage() {
  return (
    <div className="Blog">
      {/* <h1 className="BlogTitle">{metadata.title}</h1> */}
      <ArticleListPage />
    </div>
  );
}
