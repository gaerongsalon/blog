export default interface Article {
  serial: number;
  slug: string;
  writer: string;
  title: string;
  image: string;
  excerpt: string;
  category: string;
  tags: string;
  content: string;
  written: string;
  draft: number;
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
