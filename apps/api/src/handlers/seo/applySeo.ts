import Article from "../../db/entity/Article";
import ArticleMeta from "../../db/entity/ArticleMeta";
import buildImageCdnUrl from "./buildImageCdnUrl";
import fetch from "node-fetch";
import { getLogger } from "@yingyeothon/slack-logger";
import metadata from "@blog/config/lib/metadata";

const logger = getLogger("applySeo", __filename);

const predefinedIds = ["new"];

export interface SeoResult {
  content: string;
  statusCode?: number;
}

export default async function applySeo(
  requestUrl: string,
  fileContent: string,
): Promise<SeoResult> {
  const [, resource, id] = requestUrl.split(/\//g);
  if (resource !== "article" || !id || predefinedIds.includes(id)) {
    return { content: fileContent };
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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);
  const startedAt = Date.now();
  try {
    const response = await fetch(articleApiUrl, { signal: controller.signal });
    const durationMillis = Date.now() - startedAt;
    if (!response.ok) {
      if (response.status === 404) {
        logger.trace(
          { id, decodedId, durationMillis },
          "Article is not found for SEO",
        );
        return { content: fileContent, statusCode: 404 };
      }
      logger.warn(
        { id, decodedId, status: response.status, durationMillis },
        "Cannot fetch article using API",
      );
      return { content: fileContent };
    }
    const text = await response.text();
    if (!text) {
      logger.warn({ id, decodedId }, "Server returns empty response");
      return { content: fileContent };
    }
    try {
      const { article }: { article: Article } = JSON.parse(text);
      return { content: injectMeta(fileContent, article) };
    } catch (error) {
      logger.warn(
        { id, decodedId, error, text },
        "Server returns invalid JSON",
      );
    }
  } catch (error) {
    logger.error(
      { id, decodedId, durationMillis: Date.now() - startedAt, error },
      "Cannot access to server API",
    );
  } finally {
    clearTimeout(timeout);
  }
  return { content: fileContent };
}

function injectMeta(
  fileContent: string,
  { title, slug, image, excerpt }: ArticleMeta,
): string {
  const sitePrefix = metadata.url;
  const siteTitle = `[${metadata.title}] ${title}`;
  const siteUrl = `${sitePrefix}/article/${decodeURIComponent(slug)}`;
  const siteImage = buildImageCdnUrl(image);
  const meta = [
    ["name", "title", title],
    ["itemprop", "name", siteTitle],
    ["itemprop", "description", excerpt],
    ["itemprop", "image", siteImage],
    ["property", "og:url", siteUrl],
    ["property", "og:type", "website"],
    ["property", "og:title", siteTitle],
    ["property", "og:description", excerpt],
    ["property", "og:image", siteImage],
    ["property", "twitter:card", "summary_large_image"],
    ["property", "twitter:url", siteUrl],
    ["property", "twitter:title", siteTitle],
    ["property", "twitter:description", excerpt],
    ["property", "twitter:image", siteImage],
  ]
    .map(
      ([key, name, content]) =>
        `<meta ${key}="${escapeAttribute(name)}" content="${escapeAttribute(
          content,
        )}">`,
    )
    .join("");

  return fileContent
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${escapeAttribute(excerpt)}">`,
    )
    .replace(
      /<title>.*?<\/title>/i,
      `${meta}<title>${escapeText(siteTitle)}</title>`,
    );
}

function escapeAttribute(value: string): string {
  return escapeText(value).replace(/"/g, "&quot;");
}

function escapeText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
