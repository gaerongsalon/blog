import * as React from "react";

import ArticleListPage from "./ArticleListPage";
import LoginButton from "../components/LoginButton";
import isLogged from "../apis/credential/isLogged";
import logout from "../apis/credential/logout";

export default function FirstPage() {
  function logoutAndReload() {
    logout();
    window.location.reload();
  }
  return (
    <div>
      <h1>Blog</h1>
      {isLogged() ? (
        <button onClick={logoutAndReload}>Logout</button>
      ) : (
        <LoginButton />
      )}
      <ArticleListPage />
    </div>
  );
}
