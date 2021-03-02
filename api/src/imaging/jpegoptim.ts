import execa from "execa";
import { getLogger } from "@yingyeothon/slack-logger";
import prepareExternals from "./prepareExternals";

const log = getLogger("jpegoptim", __filename);

export default async function jpegoptim({
  jpgFiles,
  timeout = 10 * 1000,
}: {
  jpgFiles: string[];
  timeout?: number;
}): Promise<void> {
  const { jpegoptimPath } = await prepareExternals();
  log.trace({ jpegoptimPath, jpgFiles }, "jpegoptim: start");

  const subprocess = execa(jpegoptimPath, [
    "-f",
    "-o",
    "-v",
    "-s",
    "-m95",
    ...jpgFiles,
  ]);
  return new Promise<void>((resolve, reject) => {
    const killer = setTimeout(() => {
      subprocess.kill("SIGTERM");
      reject(new Error("jpegoptim: Timeout occurred"));
    }, timeout);
    subprocess
      .then(({ exitCode, failed, killed, stdout, stderr }) => {
        clearTimeout(killer);
        log.trace(
          { stdout, stderr, exitCode, failed, killed },
          "jpegoptim: process is completed"
        );

        // jpegoptim would return non-zero code if there are skipped images.
        log.trace({ jpgFiles }, "jpegoptim: completed");
        resolve();
      })
      .catch((reason) => {
        clearTimeout(killer);
        // jpegoptim would return non-zero code if there are skipped images.
        log.trace({ reason, jpgFiles }, "jpegoptim: completed");
        resolve();
      });
  });
}
