import HttpEndpointSpec from "@blog/serverless/lib/functions/HttpEndpointSpec";
import asHttpEndpoints from "@blog/serverless/lib/functions/asHttpEndpoints";
import secrets from "@blog/config/lib/secrets";

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
