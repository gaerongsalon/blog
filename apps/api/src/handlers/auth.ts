import "source-map-support/register";

import * as jwt from "jsonwebtoken";

import {
  APIGatewayAuthorizerHandler,
  APIGatewayAuthorizerResult,
} from "aws-lambda";
import Authorization from "./models/Authorization";
import { getLogger } from "@yingyeothon/slack-logger";
import secrets from "@blog/config/lib/secrets";

const logger = getLogger("handle:auth", __filename);

export const handle: APIGatewayAuthorizerHandler = async (event) => {
  const token =
    event.type === "TOKEN"
      ? event.authorizationToken
      : (event.queryStringParameters ?? {}).authorization;
  const context = decodeJWT(token);
  const policy: APIGatewayAuthorizerResult = {
    principalId: "user",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: context !== null ? "Allow" : "Deny",
          Resource: buildScopedMethodArn(event),
        },
      ],
    },
    context: context as any,
  };
  logger.info(
    {
      effect: context !== null ? "Allow" : "Deny",
      hasToken: Boolean(token?.trim()),
    },
    `auth`,
  );

  await logger.flushSlack();
  return policy;
};

function decodeJWT(
  authorizationToken: string | undefined,
): Authorization | null {
  const trimmed = (authorizationToken ?? "").trim();
  const token = trimmed.startsWith("Bearer ")
    ? trimmed.substring("Bearer ".length).trim()
    : trimmed;
  if (token.length === 0) {
    return null;
  }
  try {
    return jwt.verify(token, secrets.jwtSecretKey) as Authorization;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    (/jwt expired/.test(message) ? logger.debug : logger.warn)(
      {
        hasToken: token.length > 0,
        errorName: error instanceof Error ? error.name : "UnknownError",
        message,
      },
      `Invalid JWT`,
    );
    return null;
  }
}

function buildScopedMethodArn({ methodArn }: { methodArn: string }): string {
  const [, , , region, accountId, apiId, stage] = methodArn.split(/[:/]/);
  return (
    ["arn", "aws", "execute-api", region, accountId, apiId].join(":") +
    "/" +
    [stage, /* method= */ "*", /* function= */ "*"].join("/")
  );
}
