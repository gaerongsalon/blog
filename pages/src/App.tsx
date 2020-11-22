import "./App.css";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import ArticleEditPage from "./pages/ArticleEditPage";
import ArticleListPage from "./pages/ArticleListPage";
import ArticleNewPage from "./pages/ArticleNewPage";
import ArticleViewPage from "./pages/ArticleViewPage";
import FirstPage from "./pages/FirstPage";
import Head from "./components/Head";
import LoginPage from "./pages/LoginPage";
import React from "react";

export default function App() {
  return (
    <>
      <Head />
      <div className="App">
        <Router>
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
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route path="/">
              <FirstPage />
            </Route>
          </Switch>
        </Router>
      </div>
    </>
  );
}
