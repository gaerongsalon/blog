import "source-map-support/register";

import { handleApi, throwError } from "./base";

import { APIGatewayProxyHandler } from "aws-lambda";
import getImageFileNameWithDesiredWidth from "../imaging/getImageFileNameWithDesiredWidth";
import { getLogger } from "@yingyeothon/slack-logger";
import isMobile from "ismobilejs";
import redirectToCdnUrl from "./support/redirectToCdnUrl";

const logger = getLogger("handle:getImage", __filename);

export const handle: APIGatewayProxyHandler = handleApi({
  logger,
  handle: async (event) => {
    const imageKey = (event.pathParameters ?? {}).imageKey ?? throwError(404);
    const imageWidth = +((event.queryStringParameters ?? {}).w ?? "1200");
    const imagePreferredWidth = isMobile(event.headers["user-agent"]).phone
      ? Math.min(imageWidth, 600)
      : imageWidth;

    const imagePath = `image/${getImageFileNameWithDesiredWidth({
      inputFile: imageKey,
      desiredWidth: imagePreferredWidth,
    })}`;
    logger.debug(
      {
        imageKey,
        imageWidth,
        imagePreferredWidth,
        imagePath,
      },
      "Touch an image"
    );
    return redirectToCdnUrl(imagePath);
  },
});
