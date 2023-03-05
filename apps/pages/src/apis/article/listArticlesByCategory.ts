import Article from "../../models/article/Article";
import requestToServer from "../requestToServer";

export default async function listArticlesByCategory({
  category,
}: {
  category: string;
}): Promise<Article[]> {
  return await requestToServer<Article[]>({
    apiUrl: `/category/${category}`,
    method: "GET",
  });
}
