import requestToServer from "./requestToServer";

export default async function listAllCategories(): Promise<string[]> {
  return await requestToServer<string[]>({
    apiUrl: `/categories`,
    method: "GET",
  });
}
