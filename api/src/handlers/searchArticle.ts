import "source-map-support/register";

import { ApiError, handleApi } from "./base";

import { APIGatewayProxyHandler } from "aws-lambda";
import articleRepository from "../article/articleRepository";
import decodeId from "../article/decodeId";
import { getLogger } from "@yingyeothon/slack-logger";
import leven from "leven";

const logger = getLogger("handle:searchArticle", __filename);
const enduranceDistance = 60;
const candidateCounts = 5;

export const handle: APIGatewayProxyHandler = handleApi({
  logger,
  handle: async (event) => {
    const { id } = event.pathParameters ?? {};
    if (!id) {
      throw new ApiError(404);
    }
    const { fetchAllArticleSlugs } = articleRepository();
    const allSlugs = await fetchAllArticleSlugs();
    const allDistances = allSlugs
      .map(({ slug, title }) => ({
        slug,
        title,
        distance: leven(id, decodeId(slug)),
      }))
      .sort((a, b) => a.distance - b.distance);
    const candidates = allDistances
      .filter(
        ({ slug, distance }) =>
          distance <= enduranceDistance && distance < decodeId(slug).length
      )
      .slice(0, candidateCounts);
    logger.debug({ allDistances, candidates, id }, "Find candidate");
    if (!candidates) {
      throw new ApiError(404);
    }
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(candidates),
    };
  },
  options: {
    accesslog: true,
  },
});
