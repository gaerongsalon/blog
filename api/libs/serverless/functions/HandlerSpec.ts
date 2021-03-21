import HttpEndpointSpec from "./HttpEndpointSpec";

export default interface HandlerSpec {
  fileName: string;
  entrypointName?: string;
  memorySize?: number;
  timeout?: number;
  endpoints?: HttpEndpointSpec[];
  layer?: string;
}
