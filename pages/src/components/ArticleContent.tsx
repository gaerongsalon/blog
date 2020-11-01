import * as React from "react";

import ArticleEditor from "./ArticleEditor";

export default function ArticleContent({ content }: { content: string }) {
  return <ArticleEditor preview={true} content={content} />;
}
