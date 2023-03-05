import getPermission from "./getPermission";

export default function hasWritePermission(): boolean {
  return getPermission()?.writable === true;
}
