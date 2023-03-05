import getSecretOrNull from "./getSecretOrNull";

export default function getSecret(): string {
  const maybe = getSecretOrNull();
  if (!maybe) {
    throw new Error("Please login first.");
  }
  return maybe;
}
