import ArticleEditView from "../views/ArticleEditView";
import Loading from "../components/Loading";
import hasWritePermission from "../apis/credential/hasWritePermission";
import newArticle from "../models/article/newArticle";

export default function ArticleNewPage() {
  if (!hasWritePermission()) {
    return <Loading />;
  }
  return <ArticleEditView mode="new" article={newArticle()} />;
}
