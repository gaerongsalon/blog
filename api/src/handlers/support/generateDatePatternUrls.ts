import HttpEndpointSpec from "@libs/serverless/functions/HttpEndpointSpec";
import asHttpEndpoints from "@libs/serverless/functions/asHttpEndpoints";
import secrets from "@config/secrets.json";

export default function generateDatePatternUrls(): HttpEndpointSpec[] {
  const { support, startYear, endYear } = secrets.url.datePattern;
  if (!support) {
    return [];
  }
  return asHttpEndpoints(
    "GET",
    Array.from(
      { length: endYear - startYear + 1 },
      (_, index) => `/${startYear + index}/{MM}/{dd}/{articleId}`
    )
  );
}
