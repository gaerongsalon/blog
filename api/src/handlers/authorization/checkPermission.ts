import AuthorizerEvent from "./AuthorizerEvent";
import Permission from "../models/Permission";
import metadata from "../../metadata.json";
import readAuthorization from "./readAuthorization";

export default function checkPermission(event: AuthorizerEvent): Permission {
  const context = readAuthorization(event);
  if (!context) {
    return { readable: true, writable: false };
  }
  return {
    readable: true,
    writable: metadata.writers.some((writer) => writer.email === context.email),
  };
}
