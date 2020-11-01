import getSecretOrNull from "./credential/getSecretOrNull";

export default async function requestToServer<T>({
  apiUrl,
  method = "GET",
  body,
}: {
  apiUrl: string;
  method?: string;
  body?: unknown;
}): Promise<T> {
  const headers: Record<string, string> = {};
  if (body) {
    headers["Content-Type"] = "application/json";
  }
  const loginSecret = getSecretOrNull();
  if (loginSecret) {
    headers["Authorization"] = `Bearer ${loginSecret}`;
  }

  return await fetch(`/api${apiUrl}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  }).then((r) => r.json());
}
