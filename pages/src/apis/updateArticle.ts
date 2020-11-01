import Article from "../models/article/Article";
import requestToServer from "./requestToServer";

interface OkResponse {
  ok: boolean;
}

export default async function updateArticle(
  article: Article
): Promise<boolean> {
  const response = await requestToServer<OkResponse>({
    apiUrl: `/article/${article.slug}`,
    method: "PUT",
    body: article,
  });
  return response.ok;
}
