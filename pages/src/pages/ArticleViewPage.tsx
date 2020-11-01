import * as React from "react";

import ArticleView from "../views/ArticleView";
import { useParams } from "react-router-dom";

export default function ArticleViewPage() {
  let { slug } = useParams<{ slug: string }>();
  return <ArticleView slug={slug} />;
}
