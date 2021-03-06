import type { Functions } from "serverless/aws";
import asHttpEndpoints from "@libs/serverless/functions/asHttpEndpoints";
import define from "@libs/serverless/functions/define";
import generateDatePatternUrls from "./support/generateDatePatternUrls";

const resources = {
  sharp: {
    memorySize: 1024,
    timeout: 28,
    layer: "arn:aws:lambda:ap-northeast-2:467731270623:layer:sharp:1",
  },
  betterSqlite: {
    memorySize: 1024,
    timeout: 15,
    layer: "arn:aws:lambda:ap-northeast-2:467731270623:layer:BetterSqlite3:4",
  },
};

const functions: Functions = {
  ...define({ fileName: "auth" }),
  ...define({
    fileName: "grant",
    endpoints: [{ method: "POST", path: "/api/grant", authorizer: "auth" }],
  }),
  ...define({
    fileName: "getImage",
    endpoints: [{ method: "GET", path: "/image/{imageKey}" }],
  }),
  ...define({
    fileName: "getUploadUrl",
    endpoints: [
      { method: "GET", path: "/api/image/upload", authorizer: "auth" },
    ],
  }),
  ...define({
    fileName: "optimizeImage",
    endpoints: [
      { method: "POST", path: "/api/image/{uploadKey}", authorizer: "auth" },
    ],
    ...resources.sharp,
  }),
  ...define({
    fileName: "queryDatabase",
    endpoints: [
      { method: "GET", path: "/api/{resource}" },
      { method: "GET", path: "/api/{resource}/{id}" },
    ],
    ...resources.betterSqlite,
  }),
  ...define({
    fileName: "searchArticle",
    endpoints: [{ method: "GET", path: "/api/search/{id}" }],
    ...resources.betterSqlite,
  }),
  ...define({
    fileName: "upsertArticle",
    endpoints: [
      { method: "PUT", path: "/api/article/{slug}", authorizer: "auth" },
    ],
    ...resources.betterSqlite,
  }),
  ...define({
    fileName: "deleteArticle",
    endpoints: [
      { method: "DELETE", path: "/api/article/{slug}", authorizer: "auth" },
    ],
    ...resources.betterSqlite,
  }),
  ...define({
    fileName: "getSitemap",
    endpoints: [{ method: "GET", path: "/sitemap.xml" }],
    ...resources.betterSqlite,
  }),
  ...define({
    fileName: "serveHtml",
    endpoints: [
      ...asHttpEndpoints("GET", [
        "/",
        "/{file}",
        "/article/{articleId}",
        "/article/{articleId}/{action}",
        "/articles",
        "/category/{category}",
        "/categories",
        "/tag/{tag}",
        "/tags",
        "/static/css/{file}",
        "/static/js/{file}",
        "/static/media/{file}",
      ]),
      ...generateDatePatternUrls(),
    ],
  }),
};

export default functions;
