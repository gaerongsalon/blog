import secretStoreKey from "./secretStoreKey";

export default function logout(): void {
  window.localStorage.removeItem(secretStoreKey);
}
