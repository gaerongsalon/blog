import Article from "../../models/article/Article";
import OkResponse from "../OkResponse";
import requestToServer from "../requestToServer";

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
