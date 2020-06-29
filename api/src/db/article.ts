export default interface Article {
  slug: string;
  writer: string;
  title: string;
  image: string;
  excerpt: string;
  category: string;
  tags: string;
  writeDate: string;
}

export function validateArticle(article: Article): boolean {
  if (
    !article.slug ||
    !article.writer ||
    !article.title ||
    !article.image ||
    !article.category ||
    !article.writeDate
  ) {
    return false;
  }
  return true;
}
