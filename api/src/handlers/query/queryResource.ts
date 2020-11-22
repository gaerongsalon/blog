import encodeSlug from "../../utils/encodeSlug";
import queryArticle from "./queryArticle";
import queryArticles from "./queryArticles";
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
      return await queryArticles({ queryParams });
    case "categories":
      return await queryCategories();
    case "tags":
      return await queryTags();
    case "article":
      return await queryArticle({ slug: encodeSlug(id) });
  }
  return true;
}
