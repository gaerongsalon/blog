import type { AWS } from "@serverless/typescript";
import HandlerSpec from "./HandlerSpec";
import defineFunction from "./defineFunction";

type AwsFunctionHandler = NonNullable<AWS["functions"]>[string];

export default function define(spec: HandlerSpec): {
  [name: string]: AwsFunctionHandler;
} {
  return { [spec.fileName]: defineFunction(spec) };
}
