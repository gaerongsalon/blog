import "source-map-support/register";

import { ApiError, handleApi } from "./base";

import { APIGatewayProxyHandler } from "aws-lambda";
import { getLogger } from "@yingyeothon/slack-logger";
import queryResource from "./query/queryResource";

const logger = getLogger("handle:queryDatabase", __filename);

export const handle: APIGatewayProxyHandler = handleApi({
  logger,
  handle: async (event) => {
    const { resource, id } = event.pathParameters ?? {};
    if (
      !resource ||
      (["article", "category", "tag"].includes(resource) && !id)
    ) {
      throw new ApiError(404);
    }
    try {
      const data = await queryResource({
        resource,
        id: id ?? "",
        queryParams: (event.queryStringParameters ?? {}) as {
          [key: string]: string;
        },
        userAgent: event.requestContext.identity.userAgent ?? "curl",
      });
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
    } catch (error) {
      logger.debug({ resource, id, error }, "Cannot query");
      throw new ApiError(404);
    }
  },
  options: {
    accesslog: true,
  },
});
