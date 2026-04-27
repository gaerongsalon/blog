import { googleLogout, useGoogleLogin } from "@react-oauth/google";

import LinkStyledButton from "./LinkStyledButton";
import handleError from "../utils/handleError";
import handleGoogleResponse from "../apis/credential/handleGoogleResponse";
import isLogged from "../apis/credential/isLogged";
import logout from "../apis/credential/logout";

export default function LogInOutButton() {
  return isLogged() ? <LogoutButton /> : <LoginButton />;
}

function LoginButton() {
  const login = useGoogleLogin({
    onSuccess: async (result) => {
      try {
        await handleGoogleResponse(result);
        window.location.reload();
      } catch (error: any) {
        handleError(error);
      }
    },
    onError: (error) => {
      if (!/popup_closed_by_user/.test(error?.error ?? "")) {
        handleError(new Error(error.error_description ?? error.error));
      }
    },
  });

  return (
    <LinkStyledButton className="Login" onClick={() => login()}>
      LOGIN
    </LinkStyledButton>
  );
}

function LogoutButton() {
  return (
    <LinkStyledButton
      className="Logout"
      onClick={async () => {
        googleLogout();
        logout();
        window.location.replace("/");
      }}
    >
      LOGOUT
    </LinkStyledButton>
  );
}
