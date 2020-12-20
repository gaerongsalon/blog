import * as React from "react";

import ArticleMeta from "../models/article/ArticleMeta";
import Helmet from "react-helmet";
import metadata from "../metadata.json";

// https://metatags.io/
// https://www.heymeta.com/
export default function ArticleHelmet({
  article: { title, slug, excerpt, image },
}: {
  article: ArticleMeta;
}) {
  const siteTitle = `[${metadata.title}] ${title}`;
  const siteUrl = `${metadata.url}/article/${decodeURIComponent(slug)}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={excerpt} />
      {/* Google / Search Engine Tags */}
      <meta itemProp="name" content={siteTitle} />
      <meta itemProp="description" content={excerpt} />
      <meta itemProp="image" content={image} />
      {/* Facebook Meta Tags */}
      <meta property="og:url" content={siteUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={excerpt} />
      <meta property="og:image" content={image} />
      {/* Twitter Meta Tags */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={siteUrl} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={excerpt} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
}
