import ArticleMeta from "../../db/entity/ArticleMeta";
import articleRepository from "../../article/articleRepository";
import { getLogger } from "@yingyeothon/slack-logger";
import metadata from "../../metadata.json";

const logger = getLogger("applySeo", __filename);

const originalMeta = `<meta name="description" content="Blog"/><title>BLOG</title>`;

export default async function applySeo(
  requestUrl: string,
  fileContent: string
): Promise<string> {
  const [, resource, id] = requestUrl.split(/\//g);
  if (resource !== "article" || !id) {
    return fileContent;
  }
  logger.debug({ id }, "Apply SEO");
  const article = await articleRepository().fetchArticleOrNull({ slug: id });
  if (!article) {
    return fileContent;
  }
  return fileContent.replace(originalMeta, injectMeta(article));
}

function injectMeta({ title, slug, image, excerpt }: ArticleMeta): string {
  const sitePrefix = metadata.url;
  const siteTitle = `[${metadata.title}] ${title}`;
  const siteUrl = `${sitePrefix}/article/${decodeURIComponent(slug)}`;
  const siteImage = `${sitePrefix}${image}`;
  return `<head><meta name="title" content="${title}"><meta name="description" content="${excerpt}"><meta itemprop="name" content="${siteTitle}"><meta itemprop="description" content="${excerpt}"><meta itemprop="image" content="${siteImage}"><meta property="og:url" content="${siteUrl}"><meta property="og:type" content="website"><meta property="og:title" content="${siteTitle}"><meta property="og:description" content="${excerpt}"><meta property="og:image" content="${siteImage}"><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url" content="${siteUrl}"><meta property="twitter:title" content="${siteTitle}"><meta property="twitter:description" content="${excerpt}"><meta property="twitter:image" content="${siteImage}"></head>`;
}