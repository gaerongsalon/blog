import ArticleSearch from "../../models/article/ArticleSearch";
import requestToServer from "../requestToServer";

export default async function searchArticles({
  slug,
}: {
  slug: string;
}): Promise<ArticleSearch[]> {
  return await requestToServer<ArticleSearch[]>({
    apiUrl: `/search/${slug}`,
    method: "GET",
  });
}
