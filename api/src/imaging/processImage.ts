import "source-map-support/register";

import * as fs from "fs";
import * as path from "path";

import getImageFileNameWithDesiredWidth from "./getImageFileNameWithDesiredWidth";
import { getLogger } from "@yingyeothon/slack-logger";
import getPrivateS3 from "../support/getPrivateS3";
import getPrivateS3cb from "../support/getPrivateS3cb";
import getPublicS3 from "../support/getPublicS3";
import hashFile from "./hashFile";
import resizeAndOptimize from "./resizeAndOptimize";
import tempy from "tempy";
import useImageDb from "./useImageDb";

const log = getLogger("handle:processImage", __filename);

export default async function processImage({
  uploadKey,
  desiredWidths,
  timeout = 25 * 1000,
}: {
  uploadKey: string;
  desiredWidths: number[];
  timeout?: number;
}): Promise<{ imageKey: string; desiredWidths: number[] }> {
  const { exists, getJSON, putJSON } = getPrivateS3cb();
  const { downloadToLocal, deleteKey } = getPrivateS3();
  const { uploadLocalFile } = getPublicS3();
  const workspacePath = tempy.directory();

  // Step 1. Download an image file from S3.
  const localTempFile = await downloadToLocal({
    s3ObjectKey: `image-upload/${uploadKey}`,
    localFile: path.join(workspacePath, path.basename(uploadKey)),
  });

  // Step 2. Check binary hash to deduplicate.
  const imageHash = await hashFile(localTempFile);
  const imageKey = imageHash + path.extname(uploadKey);
  const inputFile = path.join(workspacePath, imageKey);
  fs.renameSync(localTempFile, inputFile);
  log.info(
    { uploadKey, imageHash, inputFile, workspacePath },
    "Start to optimize image"
  );

  // Step 3. Check if already exists and fast exit.
  const imageDb = useImageDb({ exists, getJSON, putJSON });
  if (
    await imageDb.checkExists({
      imageKeys: desiredWidths.map((desiredWidth) =>
        getImageFileNameWithDesiredWidth({ inputFile, desiredWidth })
      ),
    })
  ) {
    return { imageKey, desiredWidths };
  }

  try {
    // Step 4. Resize and optimize the input image.
    const outputFiles = await resizeAndOptimize({
      inputFile,
      outputPath: workspacePath,
      desiredWidths,
      timeout,
    });
    log.info(
      { uploadKey, inputFile, desiredWidths, outputFiles },
      "Optimization completed"
    );

    // Step 5. Upload all outputs to S3.
    const outputPairs = outputFiles.map((outputFile) => ({
      outputFile,
      outputKey: `image/${path.basename(outputFile)}`,
    }));
    await Promise.all(
      outputPairs.map(({ outputFile, outputKey }) =>
        uploadLocalFile({
          s3ObjectKey: outputKey,
          localFile: outputFile,
        })
      )
    );

    // Step 6. Update image db.
    await imageDb.add({ imageKeys: outputPairs.map((pair) => pair.outputKey) });

    return { imageKey, desiredWidths };
  } finally {
    // Step 7. Clear workspace.
    fs.rmdirSync(workspacePath, { recursive: true });
    await deleteKey({
      s3ObjectKey: `image-upload/${uploadKey}`,
    });
  }
}
