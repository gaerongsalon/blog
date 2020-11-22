import Article from "../models/article/Article";
import QuickLru from "quick-lru";
import requestToServer from "./requestToServer";

const lru = new QuickLru<string, Article>({ maxSize: 32 });

export default async function fetchArticle({
  slug,
}: {
  slug: string;
}): Promise<Article> {
  if (lru.has(slug)) {
    return lru.get(slug)!;
  }
  const article = await requestToServer<Article>({
    apiUrl: `/article/${slug}`,
    method: "GET",
  });
  lru.set(slug, article);
  return article;
}
