import Article from "../../models/article/Article";
import requestToServer from "../requestToServer";

export default async function fetchArticle({
  slug,
}: {
  slug: string;
}): Promise<Article> {
  return await requestToServer<Article>({
    apiUrl: `/article/${slug}`,
    method: "GET",
  });
}
