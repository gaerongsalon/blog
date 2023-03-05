import "./index.css";

import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import revokeGrant from "./apis/credential/revokeGrant";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

revokeGrant();
