import "source-map-support/register";

import { handleApi, throwError } from "./base";

import { APIGatewayProxyHandler } from "aws-lambda";
import { logger } from "../logger/logger";
import processImage from "../imaging/processImage";

const log = logger.get("handle:optimizeImage", __filename);
type Size = "all" | "sm" | "lg";

export const handle: APIGatewayProxyHandler = handleApi({
  log,
  handle: async (event) => {
    const uploadKey = (event.pathParameters ?? {}).uploadKey ?? throwError(404);
    const size = ((event.queryStringParameters ?? {}).size ?? "lg") as Size;
    const imageKeys = await processImage({
      uploadKey,
      desiredWidths:
        size === "all" ? [600, 1200] : size === "lg" ? [1200] : [600],
    });
    return { statusCode: 200, body: JSON.stringify(imageKeys) };
  },
});
