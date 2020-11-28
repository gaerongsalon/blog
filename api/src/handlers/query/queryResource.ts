import articleRepository from "../../repository/articleRepository";
import encodeSlug from "../../utils/encodeSlug";
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
    case "tags":
      return await queryTags();
    case "article":
      return await articleRepository().fetchArticle({ slug: encodeSlug(id) });
  }
  return true;
}
