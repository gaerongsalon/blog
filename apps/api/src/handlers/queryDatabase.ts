import "source-map-support/register";

import { ApiError, handleApi } from "./base";

import { APIGatewayProxyHandler } from "aws-lambda";
import { NoArticleError } from "../article/articleRepository";
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
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof NoArticleError) {
        logger.debug({ resource, id }, "Article is not found");
        throw new ApiError(404);
      }
      logger.warn({ resource, id, error }, "Cannot query");
      throw new ApiError(500, {
        body: "Internal Server Error",
        unexpected: true,
      });
    }
  },
  options: {
    accesslog: true,
  },
});
