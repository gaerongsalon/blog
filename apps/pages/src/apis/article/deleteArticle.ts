import Article from "../../models/article/Article";
import OkResponse from "../OkResponse";
import requestToServer from "../requestToServer";

export default async function deleteArticle(
  article: Article
): Promise<boolean> {
  const response = await requestToServer<OkResponse>({
    apiUrl: `/article/${article.slug}`,
    method: "DELETE",
  });
  return response.ok;
}
