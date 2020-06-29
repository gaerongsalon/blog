import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";
import { Logger, flushSlack } from "../logger/logger";

import { serializeError } from "serialize-error";

export class ApiError {
  constructor(
    public readonly statusCode: number,
    public readonly body: string = ""
  ) {}
}

interface HandleWithLogger<H> {
  log: Logger;
  handle: H;
  options?: {
    accesslog?: boolean;
  };
}

export function throwError(statusCode = 400, body = "") {
  return (): never => {
    throw new ApiError(statusCode, body);
  };
}

export function handleApi({
  log,
  handle: delegate,
  options: { accesslog = false } = {},
}: HandleWithLogger<
  (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>
>): APIGatewayProxyHandler {
  return async (event) => {
    const logContext = {
      path: event.path,
      query: event.queryStringParameters,
    };
    try {
      (accesslog ? log.info : log.trace)(
        logContext,
        "Start to handle API event"
      );
      const result = await delegate(event);
      (accesslog ? log.info : log.trace)(logContext, "API event is completed");
      return result;
    } catch (error) {
      if (error instanceof ApiError) {
        log.trace({ ...logContext, error }, "Error occurred in " + event.path);
        return { statusCode: error.statusCode, body: error.body };
      }
      log.warn(
        { ...logContext, error: serializeError(error) },
        "Error occurred in handling API event"
      );
    } finally {
      await flushSlack();
    }
    return { statusCode: 404, body: "Not Found" };
  };
}
