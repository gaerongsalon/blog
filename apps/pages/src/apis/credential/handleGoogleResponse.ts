import type { TokenResponse } from "@react-oauth/google";

import authorize from "./authorize";
import requestGrant from "./requestGrant";

export default async function handleGoogleResponse(
  response: Omit<TokenResponse, "error" | "error_description" | "error_uri">,
) {
  if (!response.access_token) {
    return;
  }
  await authorize(response.access_token);
  await requestGrant();
}
