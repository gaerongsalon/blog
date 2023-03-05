import Authorization from "../models/Authorization";
import AuthorizerEvent from "./AuthorizerEvent";

export default function readAuthorization(
  event: AuthorizerEvent
): Authorization | null {
  return (event.requestContext.authorizer as Authorization) ?? null;
}
