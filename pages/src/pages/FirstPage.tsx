import * as React from "react";

import ArticleListPage from "./ArticleListPage";
import { Link } from "react-router-dom";
import metadata from "../metadata.json";

export default function FirstPage() {
  return (
    <div className="Blog">
      <div className="Admin">
        <Link to="/login">Login</Link>
      </div>
      <h1 className="BlogTitle">{metadata.title}</h1>
      <ArticleListPage />
    </div>
  );
}
