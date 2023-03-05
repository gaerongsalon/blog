import { ApiError, handleApi, throwError } from "./base";

import { APIGatewayProxyHandler } from "aws-lambda";
import { getLogger } from "@yingyeothon/slack-logger";
import getPrivateS3 from "../support/getPrivateS3";
import { nanoid } from "nanoid";

const logger = getLogger("handle:getUploadUrl", __filename);
const allowedTypes = [".png", ".jpg", ".jpeg", ".gif"];

export const handle: APIGatewayProxyHandler = handleApi({
  logger,
  handle: async (event) => {
    const type = (event.queryStringParameters ?? {}).type! ?? throwError(404);
    if (!allowedTypes.includes(type)) {
      throw new ApiError(400);
    }

    const { getSignedUrl } = getPrivateS3();
    const uploadKey = newFileKey(type);
    const signedUrl = getSignedUrl({
      s3ObjectKey: `image-upload/${uploadKey}`,
      contentType: `image/${type.substring(1)}`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ uploadKey, url: signedUrl }),
    };
  },
  options: {
    authorization: true,
  },
});

function newFileKey(type: string) {
  return `${nanoid()}${type}`;
}
