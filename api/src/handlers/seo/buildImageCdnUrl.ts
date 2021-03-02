import secrets from "../../env/secrets";

export default function buildImageCdnUrl(imageUrl: string): string {
  const queryIndex = imageUrl.indexOf("?");
  if (queryIndex < 0) {
    return imageUrl;
  }
  const urlPath = imageUrl.substring(0, imageUrl.indexOf("?"));
  const urlFileName = urlPath.substring(0, urlPath.indexOf("."));
  const urlFileExt = urlPath.substring(urlPath.indexOf(".") + 1);
  return `${secrets.s3.staticFileCdnUrlPrefix}${urlFileName}_600.${urlFileExt}`;
}
