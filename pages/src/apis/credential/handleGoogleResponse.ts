import {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";

import authorize from "./authorize";

export default async function handleGoogleResponse(
  response: GoogleLoginResponse | GoogleLoginResponseOffline
) {
  if (!("accessToken" in response)) {
    return;
  }
  await authorize(response.accessToken);
}
