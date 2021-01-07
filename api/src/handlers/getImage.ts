import "source-map-support/register";

import * as path from "path";

import { handleApi, throwError } from "./base";

import { APIGatewayProxyHandler } from "aws-lambda";
import getImageFileNameWithDesiredWidth from "../imaging/getImageFileNameWithDesiredWidth";
import { getLogger } from "@yingyeothon/slack-logger";
import getPublicS3 from "../support/getPublicS3";

const logger = getLogger("handle:getImage", __filename);

export const handle: APIGatewayProxyHandler = handleApi({
  logger,
  handle: async (event) => {
    const imageKey = (event.pathParameters ?? {}).imageKey ?? throwError(404);
    const imageWidth = +((event.queryStringParameters ?? {}).w ?? "1200");

    const { s3, bucketName } = getPublicS3();
    const s3ObjectKey = `image/${getImageFileNameWithDesiredWidth({
      inputFile: imageKey,
      desiredWidth: imageWidth,
    })}`;
    const s3Object = await s3
      .getObject({
        Bucket: bucketName,
        Key: s3ObjectKey,
      })
      .promise();
    const body = s3Object.Body?.toString("base64") ?? "";
    logger.debug(
      {
        base64Length: body.length,
        contentLength: s3Object.ContentLength,
        imageKey,
        imageWidth,
      },
      "Get Image from key"
    );
    return {
      statusCode: 200,
      headers: {
        "Content-Type": `image/${path.extname(imageKey).substring(1)}`,
        "Content-Length": s3Object.ContentLength!,
        "Cache-Control": `public, max-age=${30 * 24 * 60 * 60}`,
      },
      body,
      isBase64Encoded: true,
    };
  },
});
