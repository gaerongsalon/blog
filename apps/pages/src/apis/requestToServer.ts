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

  const response = await fetch(`/api${apiUrl}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error(text, error);
    throw new Error(`Invalid JSON from server ${apiUrl}`);
  }
  // return await response.json();
}
