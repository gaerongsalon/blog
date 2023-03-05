import GoogleLogin, { GoogleLogout } from "react-google-login";

import LinkStyledButton from "./LinkStyledButton";
import handleError from "../utils/handleError";
import handleGoogleResponse from "../apis/credential/handleGoogleResponse";
import isLogged from "../apis/credential/isLogged";
import logout from "../apis/credential/logout";
import metadata from "@blog/config/lib/metadata";
import { useNavigate } from "react-router-dom";

export default function LogInOutButton() {
  return isLogged() ? <LogoutButton /> : <LoginButton />;
}

function LoginButton() {
  const navigate = useNavigate();
  return (
    <GoogleLogin
      className="Login"
      clientId={metadata.auth.googleClientId}
      buttonText="Login"
      onSuccess={async (result) => {
        try {
          await handleGoogleResponse(result);
          navigate("/");
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
  const navigate = useNavigate();
  return (
    <GoogleLogout
      className="Logout"
      clientId={metadata.auth.googleClientId}
      buttonText="Logout"
      onLogoutSuccess={async () => {
        logout();
        navigate("/");
      }}
      render={({ onClick, disabled }) => (
        <LinkStyledButton disabled={disabled} onClick={onClick}>
          LOGOUT
        </LinkStyledButton>
      )}
    />
  );
}
