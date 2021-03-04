import { APIGatewayProxyResult } from "aws-lambda";
import { URL } from "url";
import { getLogger } from "@yingyeothon/slack-logger";
import secrets from "../../env/secrets";

const logger = getLogger("redirectToCdnUrl", __filename);

export default function redirectToCdnUrl(
  relativePath: string
): APIGatewayProxyResult {
  const cdnUrl = new URL(relativePath, secrets.s3.staticFileCdnUrlPrefix).href;
  logger.debug({ cdnUrl }, "Go to CDN");
  return {
    statusCode: 301,
    headers: {
      Location: cdnUrl,
    },
    body: cdnUrl,
  };
}
