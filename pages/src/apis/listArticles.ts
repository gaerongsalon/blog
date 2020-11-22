import Article from "../models/article/Article";
import QuickLru from "quick-lru";
import requestToServer from "./requestToServer";

const lru = new QuickLru<string, Article[]>({ maxSize: 32 });

export default async function listArticles({
  offset = 0,
  limit = 100,
}: {
  offset?: number;
  limit?: number;
}): Promise<Article[]> {
  const cacheKey = `${offset}_${limit}`;
  if (lru.has(cacheKey)) {
    return lru.get(cacheKey)!;
  }
  const articles = await requestToServer<Article[]>({
    apiUrl: `/articles?offset=${offset}&limit=${limit}`,
    method: "GET",
  });
  lru.set(cacheKey, articles);
  return articles;
}
