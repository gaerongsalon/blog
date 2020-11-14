import * as jwt from "jsonwebtoken";

import {
  APIGatewayAuthorizerHandler,
  APIGatewayAuthorizerResultContext,
  APIGatewayProxyEvent,
} from "aws-lambda";

import { getLogger } from "@yingyeothon/slack-logger";
import writers from "../env/writers";

const jwtSecretKey = process.env.JWT_SECRET_KEY!;

const logger = getLogger("handle:auth", __filename);

interface Authorization extends APIGatewayAuthorizerResultContext {
  name: string;
  email: string;
  application: string;
}

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
    const payload = jwt.verify(token, jwtSecretKey) as Authorization;
    return payload;
  } catch (error) {
    logger.warn({ authorizationToken, error }, `Invalid JWT`);
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

interface Permission {
  readable: boolean;
  writable: boolean;
}

export function checkPermission(event: APIGatewayProxyEvent): Permission {
  const context = event.requestContext.authorizer as
    | Authorization
    | null
    | undefined;
  if (!context) {
    return { readable: true, writable: false };
  }
  return {
    readable: true,
    writable: writers.some((writer) => writer.email === context.email),
  };
}

export function authorize(event: APIGatewayProxyEvent): void {
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
