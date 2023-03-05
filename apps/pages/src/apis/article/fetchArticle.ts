import ArticleDocument from "../../models/article/ArticleDocument";
import requestToServer from "../requestToServer";

export default async function fetchArticle({
  slug,
}: {
  slug: string;
}): Promise<ArticleDocument> {
  return await requestToServer<ArticleDocument>({
    apiUrl: `/article/${slug}`,
    method: "GET",
  });
}
