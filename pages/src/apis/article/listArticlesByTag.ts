import Article from "../../models/article/Article";
import requestToServer from "../requestToServer";

export default async function listArticlesByTag({
  tag,
}: {
  tag: string;
}): Promise<Article[]> {
  return await requestToServer<Article[]>({
    apiUrl: `/tag/${tag}`,
    method: "GET",
  });
}
