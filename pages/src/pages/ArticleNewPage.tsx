import * as React from "react";

import ArticleEditView from "../views/ArticleEditView";
import newArticle from "../models/article/newArticle";

export default function ArticleNewPage() {
  return <ArticleEditView mode="new" article={newArticle()} />;
}
