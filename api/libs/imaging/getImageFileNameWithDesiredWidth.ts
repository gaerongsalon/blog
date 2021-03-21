import * as path from "path";

export default function getImageFileNameWithDesiredWidth({
  inputFile,
  desiredWidth,
}: {
  inputFile: string;
  desiredWidth: number;
}): string {
  const ext = path.extname(inputFile).toLowerCase();
  const imageName = path.basename(inputFile, path.extname(inputFile));
  return `${imageName}_${desiredWidth}${ext}`;
}
