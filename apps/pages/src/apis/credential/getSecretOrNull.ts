import secretStoreKey from "./secretStoreKey";

export default function getSecretOrNull(): string | null {
  return window.localStorage.getItem(secretStoreKey) ?? null;
}
