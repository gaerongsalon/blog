import * as fs from "fs";
import * as path from "path";

import getImageFileNameWithDesiredWidth from "./getImageFileNameWithDesiredWidth";
import resizeImage from "./resizeImage";

export default async function resizeOrCopy({
  inputFile,
  desiredWidth,
  inputWidth,
  outputPath,
}: {
  inputFile: string;
  desiredWidth: number;
  inputWidth?: number;
  outputPath: string;
}): Promise<string> {
  const outputFile = path.join(
    outputPath,
    getImageFileNameWithDesiredWidth({ inputFile, desiredWidth })
  );
  if (inputWidth !== undefined && inputWidth < desiredWidth) {
    fs.copyFileSync(inputFile, outputFile);
    return outputFile;
  }

  return await resizeImage({
    inputFile,
    outputFile,
    resizedWidth: desiredWidth,
  });
}
