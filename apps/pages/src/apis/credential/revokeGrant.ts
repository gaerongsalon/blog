import getSecretOrNull from "./getSecretOrNull";
import logout from "./logout";
import requestGrant from "./requestGrant";

export default async function revokeGrant() {
  if (!getSecretOrNull()) {
    return;
  }
  try {
    await requestGrant();
  } catch (error) {
    console.error(`Cannot refresh permission`, error);
    logout();
    window.location.reload();
  }
}
