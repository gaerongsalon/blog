import type ArticleMeta from "../../db/entity/ArticleMeta";
import crypto from "crypto";
import redisDel from "@yingyeothon/naive-redis/lib/del";
import redisGet from "@yingyeothon/naive-redis/lib/get";
import redisSet from "@yingyeothon/naive-redis/lib/set";
import secrets from "@blog/config/lib/secrets";
import withRedisConnection from "@blog/redis/lib/withRedisConnection";
import { getLogger } from "@yingyeothon/slack-logger";

const logger = getLogger("articleSeoCache", __filename);
const expirationMillis = 30 * 60 * 1000;
const timeoutMillis = 300;

export type SeoArticleMeta = Pick<
  ArticleMeta,
  "title" | "slug" | "image" | "excerpt"
>;

type ArticleSeoCacheEntry =
  | {
      kind: "article";
      article: SeoArticleMeta;
    }
  | {
      kind: "deleted";
    };

export type ArticleSeoCacheResult =
  | ArticleSeoCacheEntry
  | {
      kind: "miss";
    };

export function toSeoArticleMeta({
  title,
  slug,
  image,
  excerpt,
}: SeoArticleMeta): SeoArticleMeta {
  return { title, slug, image, excerpt };
}

export async function getArticleSeoCache(
  slug: string,
): Promise<ArticleSeoCacheResult> {
  const cacheKey = buildCacheKey(slug);
  try {
    const cached = await withTimeout(
      withRedisConnection({
        ...secrets.redis,
        timeoutMillis,
        doIn: async (connection) => redisGet(connection, cacheKey),
      }),
    );
    if (!cached) {
      return { kind: "miss" };
    }
    const parsed = parseCacheEntry(cached);
    if (!parsed) {
      void deleteArticleSeoCache(slug);
      return { kind: "miss" };
    }
    return parsed;
  } catch (error) {
    logger.warn({ slug, error }, "Cannot get article SEO cache");
    return { kind: "miss" };
  }
}

export async function cacheArticleSeoMeta(
  article: SeoArticleMeta,
  { strict = false }: { strict?: boolean } = {},
): Promise<boolean> {
  const meta = toSeoArticleMeta(article);
  try {
    await setCacheEntry(meta.slug, { kind: "article", article: meta });
    return true;
  } catch (error) {
    logger.warn({ slug: meta.slug, error }, "Cannot set article SEO cache");
    if (strict) {
      throw error;
    }
    return false;
  }
}

export async function tombstoneArticleSeoCache(
  slug: string,
  { strict = false }: { strict?: boolean } = {},
): Promise<boolean> {
  try {
    await setCacheEntry(slug, { kind: "deleted" });
    return true;
  } catch (error) {
    logger.warn({ slug, error }, "Cannot tombstone article SEO cache");
    if (strict) {
      throw error;
    }
    return false;
  }
}

async function deleteArticleSeoCache(slug: string): Promise<void> {
  try {
    await withTimeout(
      withRedisConnection({
        ...secrets.redis,
        timeoutMillis,
        doIn: async (connection) => {
          await redisDel(connection, buildCacheKey(slug));
        },
      }),
    );
  } catch (error) {
    logger.warn({ slug, error }, "Cannot delete article SEO cache");
  }
}

async function setCacheEntry(
  slug: string,
  entry: ArticleSeoCacheEntry,
): Promise<void> {
  await withTimeout(
    withRedisConnection({
      ...secrets.redis,
      timeoutMillis,
      doIn: async (connection) => {
        await redisSet(
          connection,
          buildCacheKey(slug),
          encodeCacheEntry(entry),
          {
            expirationMillis,
          },
        );
      },
    }),
  );
}

function encodeCacheEntry(entry: ArticleSeoCacheEntry): string {
  return Buffer.from(JSON.stringify(entry), "utf-8").toString("base64url");
}

function parseCacheEntry(value: string): ArticleSeoCacheEntry | null {
  try {
    const parsed = JSON.parse(
      Buffer.from(value, "base64url").toString("utf-8"),
    ) as ArticleSeoCacheEntry;
    if (parsed.kind === "deleted") {
      return parsed;
    }
    if (parsed.kind === "article" && isSeoArticleMeta(parsed.article)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function isSeoArticleMeta(value: unknown): value is SeoArticleMeta {
  if (!value || typeof value !== "object") {
    return false;
  }
  const maybe = value as Partial<Record<keyof SeoArticleMeta, unknown>>;
  return (
    typeof maybe.title === "string" &&
    typeof maybe.slug === "string" &&
    typeof maybe.image === "string" &&
    typeof maybe.excerpt === "string"
  );
}

async function withTimeout<T>(promise: Promise<T>): Promise<T> {
  let timeout: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeout = setTimeout(
          () => reject(new Error("Article SEO cache timeout")),
          timeoutMillis,
        );
      }),
    ]);
  } finally {
    clearTimeout(timeout);
  }
}

function buildCacheKey(slug: string): string {
  const normalizedSlug = normalizeSlug(slug);
  const slugHash = crypto
    .createHash("sha256")
    .update(normalizedSlug)
    .digest("base64url");
  return `blog/${secrets.name}::seo/article/${slugHash}`;
}

function normalizeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}
