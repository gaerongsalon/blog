import * as path from "path";

import { imageSize } from "image-size";
import jpegoptim from "./jpegoptim";
import pngquant from "./pngquant";
import resizeOrCopy from "./resizeOrCopy";

export default async function resizeAndOptimize({
  inputFile,
  outputPath,
  desiredWidths,
  timeout,
}: {
  inputFile: string;
  outputPath: string;
  desiredWidths: number[];
  timeout: number;
}): Promise<string[]> {
  const ext = path.extname(inputFile).toLowerCase();
  const size = imageSize(inputFile);
  const resizedFiles = await Promise.all(
    desiredWidths.map((desiredWidth) =>
      resizeOrCopy({
        inputFile,
        inputWidth: size.width,
        desiredWidth,
        outputPath,
      })
    )
  );
  if ([".jpg", ".jpeg"].includes(ext)) {
    await jpegoptim({
      jpgFiles: resizedFiles,
      timeout,
    });
  } else if (ext === ".png") {
    await pngquant({
      pngFiles: resizedFiles,
      timeout,
    });
  } else {
    throw new Error("Not supported type: " + ext);
  }
  return resizedFiles;
}
