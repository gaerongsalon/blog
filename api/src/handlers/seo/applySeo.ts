import Article from "../../db/entity/Article";
import ArticleMeta from "../../db/entity/ArticleMeta";
import buildImageCdnUrl from "./buildImageCdnUrl";
import fetch from "node-fetch";
import { getLogger } from "@yingyeothon/slack-logger";
import metadata from "@config/metadata.json";

const logger = getLogger("applySeo", __filename);

const originalMeta = `<meta name="description" content="Blog"/><title>${metadata.title}</title>`;

export default async function applySeo(
  requestUrl: string,
  fileContent: string
): Promise<string> {
  const [, resource, id] = requestUrl.split(/\//g);
  if (resource !== "article" || !id) {
    return fileContent;
  }
  const decodedId = decodeURIComponent(id);
  logger.debug({ id, decodedId }, "Apply SEO");

  // We cannot call DB directly because it needs a huge base to use better-sqlite3.
  // const article = await articleRepository().fetchArticleOrNull({ slug: id });
  const serverPrefix = process.env.IS_OFFLINE
    ? "http://localhost:3000"
    : metadata.url;
  const articleApiUrl = `${serverPrefix}/api/article/${id}`;
  logger.debug({ articleApiUrl, decodedId }, "Get article from api");

  try {
    const response = await fetch(articleApiUrl);
    if (!response.ok) {
      logger.warn({ id, decodedId }, "Cannot fetch article using API");
      return fileContent;
    }
    const text = await response.text();
    if (!text) {
      logger.warn({ id, decodedId }, "Server returns empty response");
      return fileContent;
    }
    try {
      const { article }: { article: Article } = JSON.parse(text);
      return fileContent.replace(originalMeta, injectMeta(article));
    } catch (error) {
      logger.warn(
        { id, decodedId, error, text },
        "Server returns invalid JSON"
      );
    }
  } catch (error) {
    logger.error({ id, decodedId }, "Cannot access to server API");
  }
  return fileContent;
}

function injectMeta({ title, slug, image, excerpt }: ArticleMeta): string {
  const sitePrefix = metadata.url;
  const siteTitle = `[${metadata.title}] ${title}`;
  const siteUrl = `${sitePrefix}/article/${decodeURIComponent(slug)}`;
  const siteImage = buildImageCdnUrl(image);
  return `<head><meta name="title" content="${title}"><meta name="description" content="${excerpt}"><meta itemprop="name" content="${siteTitle}"><meta itemprop="description" content="${excerpt}"><meta itemprop="image" content="${siteImage}"><meta property="og:url" content="${siteUrl}"><meta property="og:type" content="website"><meta property="og:title" content="${siteTitle}"><meta property="og:description" content="${excerpt}"><meta property="og:image" content="${siteImage}"><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url" content="${siteUrl}"><meta property="twitter:title" content="${siteTitle}"><meta property="twitter:description" content="${excerpt}"><meta property="twitter:image" content="${siteImage}"></head>`;
}
