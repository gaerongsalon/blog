import * as React from "react";

import GoogleLogin, { GoogleLogout } from "react-google-login";

import LinkStyledButton from "./LinkStyledButton";
import handleError from "../utils/handleError";
import handleGoogleResponse from "../apis/credential/handleGoogleResponse";
import isLogged from "../apis/credential/isLogged";
import logout from "../apis/credential/logout";
import { useHistory } from "react-router-dom";

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID!;

export default function LogInOutButton() {
  return isLogged() ? <LogoutButton /> : <LoginButton />;
}

function LoginButton() {
  const history = useHistory();
  return (
    <GoogleLogin
      className="Login"
      clientId={googleClientId}
      buttonText="Login"
      onSuccess={async (result) => {
        try {
          await handleGoogleResponse(result);
          history.go(0);
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
        <LinkStyledButton disabled={disabled} onClick={onClick}>
          LOGIN
        </LinkStyledButton>
      )}
    />
  );
}

function LogoutButton() {
  const history = useHistory();
  return (
    <GoogleLogout
      className="Logout"
      clientId={googleClientId}
      buttonText="Logout"
      onLogoutSuccess={async () => {
        logout();
        history.go(0);
      }}
      render={({ onClick, disabled }) => (
        <LinkStyledButton disabled={disabled} onClick={onClick}>
          LOGOUT
        </LinkStyledButton>
      )}
    />
  );
}
