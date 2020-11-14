import * as React from "react";

import ArticleEditView from "../views/ArticleEditView";
import { Redirect } from "react-router-dom";
import hasWritePermission from "../apis/credential/hasWritePermission";
import newArticle from "../models/article/newArticle";

export default function ArticleNewPage() {
  if (!hasWritePermission()) {
    return <Redirect to="/" />;
  }
  return <ArticleEditView mode="new" article={newArticle()} />;
}
