import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";

import { Logger } from "@yingyeothon/slack-logger";
import { authorize } from "./auth";
import { serializeError } from "serialize-error";

export class ApiError {
  constructor(
    public readonly statusCode: number,
    public readonly body: string = ""
  ) {}
}

interface HandleWithLogger<H> {
  logger: Logger;
  handle: H;
  options?: {
    accesslog?: boolean;
    authorization?: boolean;
  };
}

export function throwError(statusCode = 400, body = "") {
  return (): never => {
    throw new ApiError(statusCode, body);
  };
}

export function handleApi({
  logger,
  handle: delegate,
  options: { accesslog = false, authorization = false } = {},
}: HandleWithLogger<
  (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>
>): APIGatewayProxyHandler {
  return async (event) => {
    const logContext = {
      path: event.path,
      query: event.queryStringParameters,
    };
    try {
      if (authorization) {
        authorize(event);
      }
      (accesslog ? logger.info : logger.trace)(
        logContext,
        "Start to handle API event"
      );
      const result = await delegate(event);
      (accesslog ? logger.info : logger.trace)(
        logContext,
        "API event is completed"
      );
      return result;
    } catch (error) {
      if (error instanceof ApiError) {
        logger.trace(
          { ...logContext, error },
          "Error occurred in " + event.path
        );
        return { statusCode: error.statusCode, body: error.body };
      }
      logger.warn(
        { ...logContext, error: serializeError(error) },
        "Error occurred in handling API event"
      );
    } finally {
      await logger.flushSlack();
    }
    return { statusCode: 404, body: "Not Found" };
  };
}
