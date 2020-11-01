import secretStoreKey from "./secretStoreKey";

export default async function authorize(token: string): Promise<boolean> {
  const secret = await fetch("https://api.hoppipolla.me/auth/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      application: `blog`,
      token,
    }),
  }).then((r) => r.text());
  window.localStorage.setItem(secretStoreKey, secret);
  return true;
}
