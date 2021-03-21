import AuthorizerEvent from "./AuthorizerEvent";
import Permission from "../models/Permission";
import readAuthorization from "./readAuthorization";
import secrets from "@config/secrets.json";

export default function checkPermission(event: AuthorizerEvent): Permission {
  const context = readAuthorization(event);
  if (!context) {
    return { readable: true, writable: false };
  }
  return {
    readable: true,
    writable: secrets.writers.some((writer) => writer.email === context.email),
  };
}
