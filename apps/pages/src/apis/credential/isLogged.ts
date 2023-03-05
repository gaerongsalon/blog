import getSecretOrNull from "./getSecretOrNull";

export default function isLogged(): boolean {
  return !!getSecretOrNull();
}
