import AuthorizerEvent from "./AuthorizerEvent";
import Writer from "../models/Writer";
import metadata from "../../metadata.json";
import readAuthorization from "./readAuthorization";

export default function readWriter(event: AuthorizerEvent): Writer {
  const authorization = readAuthorization(event);
  if (!authorization) {
    throw new Error("No credential from event");
  }
  const writer = metadata.writers.find((w) => w.email === authorization.email);
  if (!writer) {
    throw new Error("Cannot find writers from context");
  }
  return writer;
}
