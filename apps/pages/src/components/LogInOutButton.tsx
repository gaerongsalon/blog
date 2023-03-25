import GoogleLogin, { GoogleLogout } from "react-google-login";

import LinkStyledButton from "./LinkStyledButton";
import handleError from "../utils/handleError";
import handleGoogleResponse from "../apis/credential/handleGoogleResponse";
import isLogged from "../apis/credential/isLogged";
import logout from "../apis/credential/logout";
import metadata from "@blog/config/lib/metadata";

export default function LogInOutButton() {
  return isLogged() ? <LogoutButton /> : <LoginButton />;
}

function LoginButton() {
  return (
    <GoogleLogin
      className="Login"
      clientId={metadata.auth.googleClientId}
      buttonText="Login"
      onSuccess={async (result) => {
        try {
          await handleGoogleResponse(result);
          window.location.reload();
        } catch (error: any) {
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
  return (
    <GoogleLogout
      className="Logout"
      clientId={metadata.auth.googleClientId}
      buttonText="Logout"
      onLogoutSuccess={async () => {
        logout();
        window.location.replace("/");
      }}
      render={({ onClick, disabled }) => (
        <LinkStyledButton disabled={disabled} onClick={onClick}>
          LOGOUT
        </LinkStyledButton>
      )}
    />
  );
}
