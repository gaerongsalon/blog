import Permission from "./Permission";
import permissionStoreKey from "./permissionStoreKey";
import requestToServer from "../requestToServer";

export default async function requestGrant(): Promise<boolean> {
  const permission = await requestToServer<Permission>({
    apiUrl: `/grant`,
    method: "POST",
  });
  window.localStorage.setItem(permissionStoreKey, JSON.stringify(permission));
  return true;
}
