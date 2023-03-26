import "source-map-support/register";

import { APIGatewayProxyHandler } from "aws-lambda";
import articleRepository from "../article/articleRepository";
import { getLogger } from "@yingyeothon/slack-logger";
import { handleApi } from "./base";
import metadata from "@blog/config/lib/metadata";

const logger = getLogger("handle:sitemap", __filename);

export const handle: APIGatewayProxyHandler = handleApi({
  logger: logger,
  handle: async () => {
    const slugs = await articleRepository().fetchAllArticleSlugs();
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${slugs
      .map(
        ({ slug }) => `<url><loc>${metadata.url}/article/${slug}</loc></url>`
      )
      .join("")}</urlset>`;
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/xml",
        "Content-Length": Buffer.from(sitemap, "utf-8").byteLength,
      },
      body: sitemap,
    };
  },
});
