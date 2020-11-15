import * as React from "react";

import LoginButton from "../components/LoginButton";
import isLogged from "../apis/credential/isLogged";
import logout from "../apis/credential/logout";

export default function LoginPage() {
  function logoutAndReload() {
    logout();
    window.location.replace("/");
  }
  return (
    <div className="LoginPage">
      {isLogged() ? (
        <button className="Logout" onClick={logoutAndReload}>
          Logout
        </button>
      ) : (
        <LoginButton />
      )}
    </div>
  );
}
