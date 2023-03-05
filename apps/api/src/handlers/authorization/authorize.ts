import { APIGatewayProxyEvent } from "aws-lambda";
import checkPermission from "./checkPermission";
import { getLogger } from "@yingyeothon/slack-logger";

const logger = getLogger("authorize", __filename);

export default function authorize(event: APIGatewayProxyEvent): void {
  logger.debug(
    {
      url: event.path,
      headers: event.headers,
      context: event.requestContext.authorizer,
    },
    "Check authorization"
  );
  const grant = checkPermission(event);
  if (!grant.writable) {
    throw new Error(
      "Not authorized: " + JSON.stringify(event.requestContext.authorizer)
    );
  }
}
