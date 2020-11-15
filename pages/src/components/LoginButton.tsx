import * as React from "react";

import GoogleLogin from "react-google-login";
import handleError from "../utils/handleError";
import handleGoogleResponse from "../apis/credential/handleGoogleResponse";

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID!;

export default function LoginButton() {
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
      onFailure={handleError}
      cookiePolicy={"single_host_origin"}
    />
  );
}
