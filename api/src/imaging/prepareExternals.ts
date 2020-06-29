import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import tar from "tar";

interface Executables {
  pngquantPath: string;
  jpegoptimPath: string;
}

export default function prepareExternals(): Promise<Executables> {
  return new Promise<Executables>((resolve, reject) => {
    const jpegoptimPath = path.join(os.tmpdir(), "bin", "jpegoptim");
    const pngquantPath = path.join(os.tmpdir(), "bin", "pngquant");
    if (fs.existsSync(jpegoptimPath) && fs.existsSync(pngquantPath)) {
      return resolve({ jpegoptimPath, pngquantPath });
    }
    const externalTgzName = "exodus-pngquant-jpegoptim-bundle.tgz";
    const externalTgzPath = fs.existsSync(externalTgzName)
      ? externalTgzName
      : path.join(".external", externalTgzName);
    fs.createReadStream(externalTgzPath)
      .pipe(
        tar
          .x({
            strip: 1,
            C: "/tmp",
          })
          .on("error", reject)
          .on("close", () =>
            fs.existsSync(jpegoptimPath)
              ? resolve({ jpegoptimPath, pngquantPath })
              : reject(new Error(`Cannot extract ${externalTgzPath}`))
          )
      )
      .on("error", reject);
  });
}
