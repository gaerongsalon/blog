import Permission from "./Permission";
import permissionStoreKey from "./permissionStoreKey";

export default function getPermission(): Permission | null {
  const maybe = window.localStorage.getItem(permissionStoreKey);
  return !!maybe ? (JSON.parse(maybe) as Permission) : null;
}
