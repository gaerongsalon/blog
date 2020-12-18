import "./App.css";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import ArticleEditPage from "./pages/ArticleEditPage";
import ArticleListPage from "./pages/ArticleListPage";
import ArticleNewPage from "./pages/ArticleNewPage";
import ArticleViewPage from "./pages/ArticleViewPage";
import FirstPage from "./pages/FirstPage";
import Head from "./components/Head";
import React from "react";
import styled from "styled-components";

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
        <Switch>
          <Route path="/articles">
            <ArticleListPage />
          </Route>
          <Route path="/article/new">
            <ArticleNewPage />
          </Route>
          <Route path="/article/:slug/edit">
            <ArticleEditPage />
          </Route>
          <Route path="/article/:slug">
            <ArticleViewPage />
          </Route>
          <Route path="/">
            <FirstPage />
          </Route>
        </Switch>
      </AppDiv>
    </Router>
  );
}
