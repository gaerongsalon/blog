import "source-map-support/register";

import { APIGatewayProxyHandler } from "aws-lambda";
import { checkPermission } from "./auth";
import { getLogger } from "@yingyeothon/slack-logger";
import { handleApi } from "./base";

const logger = getLogger("handle:grant", __filename);

export const handle: APIGatewayProxyHandler = handleApi({
  logger: logger,
  handle: async (event) => {
    return {
      statusCode: 200,
      body: JSON.stringify(checkPermission(event)),
    };
  },
  options: {
    authorization: true,
  },
});
