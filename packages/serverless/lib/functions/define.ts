import { AwsFunctionHandler } from "serverless/aws";
import HandlerSpec from "./HandlerSpec";
import defineFunction from "./defineFunction";

export default function define(spec: HandlerSpec): {
  [name: string]: AwsFunctionHandler;
} {
  return { [spec.fileName]: defineFunction(spec) };
}
