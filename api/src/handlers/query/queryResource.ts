import articleRepository from "../../article/articleRepository";
import encodeId from "../../article/encodeId";
import queryCategories from "./queryCategories";
import queryTags from "./queryTags";

export default async function queryResource({
  resource,
  id,
  queryParams,
}: {
  resource: string;
  id: string;
  queryParams: { [key: string]: string };
}): Promise<unknown> {
  switch (resource) {
    case "articles":
      return await articleRepository().fetchArticles({
        offset: +(queryParams?.offset ?? 0),
        limit: +(queryParams?.limit ?? 100),
      });
    case "categories":
      return await queryCategories();
    case "category":
      return await articleRepository().fetchArticlesByCategory({
        category: id,
      });
    case "tags":
      return await queryTags();
    case "tag":
      return await articleRepository().fetchArticlesByTag({
        tag: id,
      });
    case "article":
      return await articleRepository().fetchArticleDocument({
        slug: encodeId(id),
      });
  }
  return true;
}
