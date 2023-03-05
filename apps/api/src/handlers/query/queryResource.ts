import articleRepository from "../../article/articleRepository";
import encodeId from "../../article/encodeId";
import isbot from "isbot";
import queryCategories from "./queryCategories";
import queryOrIncreaseHits from "./queryOrIncreaseHits";
import queryTags from "./queryTags";

export default async function queryResource({
  resource,
  id,
  queryParams,
  userAgent,
}: {
  resource: string;
  id: string;
  queryParams: { [key: string]: string };
  userAgent: string;
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
        category: decodeURIComponent(id),
      });
    case "tags":
      return await queryTags();
    case "tag":
      return await articleRepository().fetchArticlesByTag({
        tag: decodeURIComponent(id),
      });
    case "article":
      const document = await articleRepository().fetchArticleDocument({
        slug: encodeId(id),
      });
      const hits = await queryOrIncreaseHits(resource, id, isbot(userAgent));
      return { ...document, article: { ...document.article, hits } };
  }
  return true;
}
