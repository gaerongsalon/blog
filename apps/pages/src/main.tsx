import "./index.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { HelmetProvider } from "react-helmet-async";

import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import metadata from "@blog/config/lib/metadata";
import revokeGrant from "./apis/credential/revokeGrant";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={metadata.auth.googleClientId}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);

revokeGrant();
