import { handleApi, throwError } from "./base";

import { APIGatewayProxyHandler } from "aws-lambda";
import { getLogger } from "@yingyeothon/slack-logger";
import getPrivateS3 from "../support/getPrivateS3";
import getPrivateS3cb from "../support/getPrivateS3cb";
import getPublicS3 from "../support/getPublicS3";
import processImage from "@blog/imaging/lib/processImage";

const logger = getLogger("handle:optimizeImage", __filename);
type Size = "all" | "sm" | "lg";

export const handle: APIGatewayProxyHandler = handleApi({
  logger,
  handle: async (event) => {
    const uploadKey =
      (event.pathParameters ?? {}).uploadKey! ?? throwError(404);
    const size = ((event.queryStringParameters ?? {}).size ?? "all") as Size;

    const { exists, getJSON, putJSON } = getPrivateS3cb();
    const { downloadToLocal, deleteKey } = getPrivateS3();
    const { uploadLocalFile } = getPublicS3();
    const imageKeys = await processImage({
      uploadKey,
      desiredWidths:
        size === "all" ? [600, 1200] : size === "lg" ? [1200] : [600],
      storage: {
        private: { exists, getJSON, putJSON, downloadToLocal, deleteKey },
        public: { uploadLocalFile },
      },
    });
    return { statusCode: 200, body: JSON.stringify(imageKeys) };
  },
  options: {
    authorization: true,
  },
});
