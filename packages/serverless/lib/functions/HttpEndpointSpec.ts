export default interface HttpEndpointSpec {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  authorizer?: string;
}
