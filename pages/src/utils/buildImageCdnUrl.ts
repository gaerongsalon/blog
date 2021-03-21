import isMobile from "ismobilejs";
import metadata from "@config/metadata.json";

export default function buildImageCdnUrl(imageUrl: string): string {
  const queryIndex = imageUrl.indexOf("?");
  if (queryIndex < 0) {
    return imageUrl;
  }
  const urlPath = imageUrl.substring(0, imageUrl.indexOf("?"));
  const urlFileName = urlPath.substring(0, urlPath.indexOf("."));
  const urlFileExt = urlPath.substring(urlPath.indexOf(".") + 1);
  const width = +(new URLSearchParams(imageUrl).get("w") ?? "600");
  const preferredWidth = isMobile(navigator).phone
    ? Math.min(width, 600)
    : width;
  return `${metadata.cdnUrl}${urlFileName}_${preferredWidth}.${urlFileExt}`;
}
