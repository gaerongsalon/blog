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
    if (!resource || (resource === "article" && !id)) {
      throw new ApiError(404);
    }
    const body = JSON.stringify(
      await queryResource({
        resource,
        id,
        queryParams: event.queryStringParameters ?? {},
      })
    );
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body,
    };
  },
  options: {
    accesslog: true,
  },
});
