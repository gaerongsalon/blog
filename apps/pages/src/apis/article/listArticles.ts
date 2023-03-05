import Article from "../../models/article/Article";
import requestToServer from "../requestToServer";

export default async function listArticles({
  offset = 0,
  limit = 100,
}: {
  offset?: number;
  limit?: number;
}): Promise<Article[]> {
  return await requestToServer<Article[]>({
    apiUrl: `/articles?offset=${offset}&limit=${limit}`,
    method: "GET",
  });
}
