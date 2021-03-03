import "./App.css";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import BeatLoader from "react-spinners/BeatLoader";
import Head from "./components/Head";
import React from "react";
import styled from "styled-components";

const LazyArticleEditPage = React.lazy(() => import("./pages/ArticleEditPage"));
const LazyArticleListPage = React.lazy(() => import("./pages/ArticleListPage"));
const LazyArticleNewPage = React.lazy(() => import("./pages/ArticleNewPage"));
const LazyArticleViewPage = React.lazy(() => import("./pages/ArticleViewPage"));
const LazyCategoryPage = React.lazy(() => import("./pages/CategoryPage"));
const LazyTagPage = React.lazy(() => import("./pages/TagPage"));
const LazyFirstPage = React.lazy(() => import("./pages/FirstPage"));

const AppDiv = styled.div`
  margin: auto;
  width: 60vw;
  max-width: 1024px;
  padding-top: 1rem;
  padding-bottom: 4rem;

  @media (max-width: 1280px) {
    width: 72vw;
  }

  @media (max-width: 800px) {
    width: 90vw;
    min-width: auto;
    padding-bottom: 2rem;
  }
`;

export default function App() {
  return (
    <Router>
      <Head />
      <AppDiv>
        <React.Suspense fallback={<div></div>}>
          <Switch>
            <Route path="/articles">
              <LazyArticleListPage />
            </Route>
            <Route path="/article/new">
              <LazyArticleNewPage />
            </Route>
            <Route path="/article/:slug/edit">
              <LazyArticleEditPage />
            </Route>
            <Route path="/article/:slug">
              <LazyArticleViewPage />
            </Route>
            <Route path="/:yyyy/:mm/:dd/:slug">
              <LazyArticleViewPage />
            </Route>
            <Route path="/category/:category">
              <LazyCategoryPage />
            </Route>
            <Route path="/tag/:tag">
              <LazyTagPage />
            </Route>
            <Route path="/">
              <LazyFirstPage />
            </Route>
          </Switch>
        </React.Suspense>
      </AppDiv>
      <div className="overlay">
        <BeatLoader />
      </div>
    </Router>
  );
}
