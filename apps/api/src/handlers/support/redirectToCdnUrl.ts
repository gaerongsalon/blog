import { APIGatewayProxyResult } from "aws-lambda";
import { URL } from "url";
import { getLogger } from "@yingyeothon/slack-logger";
import metadata from "@blog/config/lib/metadata";

const logger = getLogger("redirectToCdnUrl", __filename);

export default function redirectToCdnUrl(
  relativePath: string
): APIGatewayProxyResult {
  const cdnUrl = new URL(relativePath, metadata.cdnUrl).href;
  logger.debug({ cdnUrl }, "Go to CDN");
  return {
    statusCode: 301,
    headers: {
      Location: cdnUrl,
    },
    body: cdnUrl,
  };
}
