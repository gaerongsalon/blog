import * as React from "react";

import GoogleLogin, { GoogleLogout } from "react-google-login";

import handleError from "../utils/handleError";
import handleGoogleResponse from "../apis/credential/handleGoogleResponse";
import isLogged from "../apis/credential/isLogged";
import logout from "../apis/credential/logout";

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID!;

export default function LogInOutButton() {
  return isLogged() ? <LogoutButton /> : <LoginButton />;
}

function LoginButton() {
  return (
    <GoogleLogin
      className="Login"
      clientId={googleClientId}
      buttonText="Login"
      onSuccess={async (result) => {
        try {
          await handleGoogleResponse(result);
          window.location.replace("/");
        } catch (error) {
          handleError(error);
        }
      }}
      onFailure={(error) => {
        if (!/popup_closed_by_user/.test(error?.error)) {
          handleError(error);
        }
      }}
      cookiePolicy={"single_host_origin"}
      render={({ onClick, disabled }) => (
        <button disabled={disabled} onClick={onClick}>
          Login
        </button>
      )}
    />
  );
}

function LogoutButton() {
  return (
    <GoogleLogout
      className="Logout"
      clientId={googleClientId}
      buttonText="Logout"
      onLogoutSuccess={async () => {
        logout();
        window.location.replace("/");
      }}
      render={({ onClick, disabled }) => (
        <button disabled={disabled} onClick={onClick}>
          Logout
        </button>
      )}
    />
  );
}
