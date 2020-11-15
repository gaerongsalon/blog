import AuthorizerEvent from "./AuthorizerEvent";
import { Writer } from "../../env/writers";
import readAuthorization from "./readAuthorization";
import writers from "../../env/writers";

export default function readWriter(event: AuthorizerEvent): Writer {
  const authorization = readAuthorization(event);
  if (!authorization) {
    throw new Error("No credential from event");
  }
  const writer = writers.find((w) => w.email === authorization.email);
  if (!writer) {
    throw new Error("Cannot find writers from context");
  }
  return writer;
}
