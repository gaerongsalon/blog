import ArticleMeta from "./ArticleMeta";

export default interface Article extends ArticleMeta {
  content: string;
  hits: number;
}
