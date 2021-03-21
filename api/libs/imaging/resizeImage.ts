import { getLogger } from "@yingyeothon/slack-logger";
import sharp from "sharp";

const log = getLogger("resizeImage", __filename);

export default async function resizeImage({
  inputFile,
  outputFile,
  resizedWidth,
}: {
  inputFile: string;
  outputFile: string;
  resizedWidth: number;
}): Promise<string> {
  log.trace({ inputFile, outputFile, resizedWidth }, "sharp: resize");
  await sharp(inputFile).resize(resizedWidth).toFile(outputFile);
  return outputFile;
}
