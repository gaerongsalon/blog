import permissionStoreKey from "./permissionStoreKey";
import secretStoreKey from "./secretStoreKey";

export default function logout(): void {
  window.localStorage.removeItem(secretStoreKey);
  window.localStorage.removeItem(permissionStoreKey);
}
