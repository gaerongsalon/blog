import { AwsFunctionHandler } from "serverless/aws";
import HandlerSpec from "./HandlerSpec";

export default function defineFunction({
  fileName,
  entrypointName = "handle",
  memorySize = 256,
  timeout = 5,
  endpoints,
  layer,
  packagePatterns,
}: HandlerSpec): AwsFunctionHandler {
  return {
    handler: `src/handlers/${fileName}.${entrypointName}`,
    memorySize,
    timeout,
    events: endpoints
      ? endpoints.map((http) => ({
          http,
        }))
      : undefined,
    layers: layer ? [layer] : undefined,
    package: packagePatterns
      ? {
          patterns: packagePatterns,
        }
      : undefined,
  };
}
