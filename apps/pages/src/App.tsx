import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

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
    <BrowserRouter>
      <Head />
      <AppDiv>
        <React.Suspense fallback={<div></div>}>
          <Routes>
            <Route path="/articles" element={<LazyArticleListPage />} />
            <Route path="/article/new" element={<LazyArticleNewPage />} />
            <Route
              path="/article/:slug/edit"
              element={<LazyArticleEditPage />}
            />
            <Route path="/article/:slug" element={<LazyArticleViewPage />} />
            <Route
              path="/:yyyy/:mm/:dd/:slug"
              element={<LazyArticleViewPage />}
            />
            <Route path="/category/:category" element={<LazyCategoryPage />} />
            <Route path="/tag/:tag" element={<LazyTagPage />} />
            <Route path="/" element={<LazyFirstPage />} />
          </Routes>
        </React.Suspense>
      </AppDiv>
      <div className="overlay">
        <BeatLoader />
      </div>
    </BrowserRouter>
  );
}
