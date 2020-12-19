import ArticleMeta from "./ArticleMeta";

export default interface Article extends ArticleMeta {
  content: string;
}

export const articlePropertyKeys: (keyof Article)[] = [
  "serial",
  "slug",
  "writer",
  "title",
  "image",
  "excerpt",
  "category",
  "tags",
  "content",
  "written",
  "draft",
];

export function validateArticle(
  article: Partial<Article>,
  { withoutSerial }: { withoutSerial: boolean }
): boolean {
  for (const key of articlePropertyKeys) {
    if (key === "serial" && withoutSerial) {
      continue;
    }
    if (!(key in article)) {
      return false;
    }
  }
  return true;
}
