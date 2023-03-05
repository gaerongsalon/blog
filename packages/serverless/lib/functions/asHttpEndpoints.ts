import HttpEndpointSpec from "./HttpEndpointSpec";

export default function asHttpEndpoints(
  method: HttpEndpointSpec["method"],
  paths: string[]
): HttpEndpointSpec[] {
  return paths.map((path) => ({ method, path }));
}
