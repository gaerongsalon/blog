import "source-map-support/register";

import * as fs from "fs";
import * as path from "path";

import { ApiError, handleApi } from "./base";

import { APIGatewayProxyHandler } from "aws-lambda";
import applySeo from "./seo/applySeo";
import { contentType } from "mime-types";
import { getLogger } from "@yingyeothon/slack-logger";

const logger = getLogger("handle:serveHtml", __filename);
const resourceRoot = "pages";

const indexHtml = "index.html";
const textTypes = [".css", ".html", ".js", ".json", ".map", ".svg", ".txt"];

function translateToBundlePath(requestUrl: string): string {
  let maybe = requestUrl;
  while (maybe.startsWith("/")) {
    maybe = maybe.substr(1);
  }
  return maybe || indexHtml;
}

function resolveBundlePath(requestUrl: string): string {
  const requestPath = translateToBundlePath(requestUrl);
  const resourceFilePath = path.join(resourceRoot, requestPath);
  logger.trace(
    { requestPath, resourceFilePath },
    "Find a static resource to serve"
  );
  if (fs.existsSync(resourceFilePath)) {
    return resourceFilePath;
  }
  const extname = path.extname(resourceFilePath);
  if (extname !== "" && extname !== ".html") {
    throw new ApiError(404);
  }
  // To use react-router, return "index.html" if it requests any html resources.
  const indexFilePath = path.join(resourceRoot, indexHtml);
  logger.trace(
    { requestPath, indexFilePath },
    "Resolve as index due to not exist"
  );
  return indexFilePath;
}

export const handle: APIGatewayProxyHandler = handleApi({
  logger: logger,
  handle: async (event) => {
    // Experimental: Use CDN for static files.
    // if (/^\/assets\//.test(event.path)) {
    //   return redirectToCdnUrl(event.path);
    // }
    const resourceFilePath = resolveBundlePath(event.path);
    const toBase64 = !textTypes.some((ext) => resourceFilePath.endsWith(ext));
    const fileContent = fs
      .readFileSync(resourceFilePath)
      .toString(toBase64 ? "base64" : "utf-8");
    const seoable = resourceFilePath.endsWith(indexHtml);
    const finalContent = seoable
      ? await applySeo(event.path, fileContent)
      : fileContent;
    const fileSize = seoable
      ? Buffer.from(finalContent, "utf-8").byteLength
      : fs.lstatSync(resourceFilePath).size;
    return {
      statusCode: 200,
      headers: {
        "Content-Type":
          contentType(path.basename(resourceFilePath)) ||
          "application/octet-stream",
        "Content-Length": fileSize,
        "Cache-Control": `public, max-age=${
          resourceFilePath.endsWith(".html") ? 10 * 60 : 30 * 24 * 60 * 60
        }`,
      },
      body: finalContent,
      isBase64Encoded: toBase64,
    };
  },
});
