import "source-map-support/register";

import { ApiError, handleApi, throwError } from "./base";

import { APIGatewayProxyHandler } from "aws-lambda";
import { logger } from "../logger/logger";
import { nanoid } from "nanoid";
import useS3 from "../aws/useS3";

const log = logger.get("handle:getUploadUrl", __filename);
const allowedTypes = [".png", ".jpg"];

export const handle: APIGatewayProxyHandler = handleApi({
  log,
  handle: async (event) => {
    const type = (event.queryStringParameters ?? {}).type ?? throwError(404);
    if (!allowedTypes.includes(type)) {
      throw new ApiError(400);
    }

    const { s3, bucketName } = useS3();
    const uploadKey = newFileKey(type);
    const signedUrl = s3.getSignedUrl("putObject", {
      Bucket: bucketName,
      Key: `image-upload/${uploadKey}`,
      Expires: 60 * 10,
      ContentType: `application/${type.substring(1)}`,
      ACL: "public-read",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ uploadKey, url: signedUrl }),
    };
  },
});

function newFileKey(type: string) {
  return `${nanoid()}${type}`;
}
