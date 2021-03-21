import * as crypto from "crypto";
import * as fs from "fs";

export default function hashFile(filePath: string): Promise<string> {
  const hash = crypto.createHash("sha1");
  return new Promise<string>((resolve, reject) =>
    fs
      .createReadStream(filePath)
      .on("error", reject)
      .on("data", (chunk) => hash.update(chunk))
      .on("end", () => resolve(hash.digest("hex")))
  );
}
