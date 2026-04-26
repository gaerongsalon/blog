# @blog/serverless

Small helpers for defining Serverless Framework Lambda functions and HTTP events.

## Key Paths

- `lib/functions/HandlerSpec.ts`: Function definition input shape.
- `lib/functions/HttpEndpointSpec.ts`: HTTP method, path, and authorizer shape.
- `lib/functions/defineFunction.ts`: Converts a handler spec into Serverless function config.
- `lib/functions/define.ts`: Names a generated function config by file name.
- `lib/functions/asHttpEndpoints.ts`: Expands route paths into endpoint specs.

## Usage

`apps/api/src/handlers/functions.ts` uses this package to keep Lambda endpoint definitions compact.

