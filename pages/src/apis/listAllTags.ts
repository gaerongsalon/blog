import requestToServer from "./requestToServer";

export default async function listAllTags(): Promise<string[]> {
  return await requestToServer<string[]>({
    apiUrl: `/tags`,
    method: "GET",
  });
}
