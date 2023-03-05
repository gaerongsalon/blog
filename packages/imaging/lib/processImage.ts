import * as fs from "fs";
import * as path from "path";

import S3 from "@blog/aws/lib/S3";
import getImageFileNameWithDesiredWidth from "./getImageFileNameWithDesiredWidth";
import { getLogger } from "@yingyeothon/slack-logger";
import hashFile from "./hashFile";
import resizeAndOptimize from "./resizeAndOptimize";
import { temporaryDirectory } from "tempy";
import useImageDb from "./useImageDb";

const log = getLogger("handle:processImage", __filename);

interface Storage {
  private: Pick<
    S3,
    "exists" | "getJSON" | "putJSON" | "downloadToLocal" | "deleteKey"
  >;
  public: Pick<S3, "uploadLocalFile">;
}

export default async function processImage({
  uploadKey,
  desiredWidths,
  timeout = 25 * 1000,
  storage: {
    private: { exists, getJSON, putJSON, downloadToLocal, deleteKey },
    public: { uploadLocalFile },
  },
}: {
  uploadKey: string;
  desiredWidths: number[];
  timeout?: number;
  storage: Storage;
}): Promise<{ imageKey: string; desiredWidths: number[] }> {
  const workspacePath = temporaryDirectory();

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
