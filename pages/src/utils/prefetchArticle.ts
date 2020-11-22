import fetchArticle from "../apis/fetchArticle";

const fetched = new Set<string>();

export default function prefetchArticle(slug: string) {
  if (fetched.has(slug)) {
    return;
  }
  fetched.add(slug);
  fetchArticle({ slug }).then(console.info).catch(console.error);
}
