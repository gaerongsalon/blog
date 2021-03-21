import * as jwt from "jsonwebtoken";

import { APIGatewayAuthorizerHandler } from "aws-lambda";
import Authorization from "./models/Authorization";
import { getLogger } from "@yingyeothon/slack-logger";
import secrets from "@config/secrets.json";

const logger = getLogger("handle:auth", __filename);

export const handle: APIGatewayAuthorizerHandler = async (event) => {
  const token =
    event.type === "TOKEN"
      ? event.authorizationToken
      : (event.queryStringParameters ?? {}).authorization;
  const context = decodeJWT(token);
  const policy = {
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
    context,
  };
  logger.info({ policy, token }, `auth`);

  await logger.flushSlack();
  return policy;
};

function decodeJWT(
  authorizationToken: string | undefined
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
  } catch (error) {
    (/jwt expired/.test(error.message) ? logger.debug : logger.warn)(
      { authorizationToken, error },
      `Invalid JWT`
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
