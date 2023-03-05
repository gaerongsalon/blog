import { APIGatewayAuthorizerResultContext } from "aws-lambda";

export default interface Authorization
  extends APIGatewayAuthorizerResultContext {
  name: string;
  email: string;
  application: string;
}
