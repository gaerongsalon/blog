import Article from "./Article";
import ArticleMeta from "./ArticleMeta";

export default interface ArticleDocument {
  article: Article;
  recommendations: ArticleMeta[];
}
