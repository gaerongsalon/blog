import * as React from "react";

import ArticleDocument from "../models/article/ArticleDocument";
import ArticleSearch from "../models/article/ArticleSearch";
import ArticleSearchList from "../components/ArticleSearchList";
import ArticleView from "../views/ArticleView";
import Loading from "../components/Loading";
import PageNotFound from "../components/PageNotFound";
import fetchArticle from "../apis/article/fetchArticle";
import scroll from "../utils/scroll";
import searchArticles from "../apis/article/searchArticles";
import syntaxOn from "../utils/syntaxOn";
import { useParams } from "react-router-dom";

enum LoadingStage {
  Loading,
  Loaded,
  Search,
  NotFound,
}

type ArticleState =
  | {
      stage: LoadingStage.Loading;
    }
  | { stage: LoadingStage.Loaded; document: ArticleDocument }
  | { stage: LoadingStage.NotFound }
  | { stage: LoadingStage.Search; search: ArticleSearch[] };

export default function ArticleViewPage() {
  let { slug } = useParams<{ slug: string }>();
  const [state, setState] = React.useState<ArticleState>({
    stage: LoadingStage.Loading,
  });
  React.useEffect(
    function () {
      loadArticleState(slug, setState);
    },
    [slug, setState]
  );
  if (state.stage === LoadingStage.Loading) {
    return <Loading />;
  }
  if (state.stage === LoadingStage.NotFound) {
    return <PageNotFound />;
  }
  if (state.stage === LoadingStage.Search) {
    return <ArticleSearchList search={state.search} />;
  }
  return <ArticleView document={state.document} />;
}

async function loadArticleState(
  slug: string,
  updateState: (state: ArticleState) => void
) {
  try {
    const doc = await fetchArticle({ slug });
    updateState({ stage: LoadingStage.Loaded, document: doc });
    scroll({ key: "article" }).top();
    syntaxOn();
  } catch (error) {
    console.error(error);
    try {
      const search = await searchArticles({ slug });
      updateState({ stage: LoadingStage.Search, search });
    } catch (error) {
      console.error(error);
      updateState({ stage: LoadingStage.NotFound });
    }
  }
}
