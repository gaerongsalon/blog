import S3 from "../aws/S3";
import closeSqliteDatabase from "./closeSqliteDatabase";
import getSqliteDatabase from "./getSqliteDatabase";
import putSqliteDatabase from "./putSqliteDatabase";
import tempy from "tempy";
import withSqliteDatabase from "./withSqliteDatabase";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function useS3Sqlite({
  dbIdToS3Key = (dbId: string) => `sqlite/${dbId}.db`,
  exists,
  downloadToLocal,
  uploadLocalFile,
}: {
  dbIdToS3Key?: (dbId: string) => string;
} & Pick<S3, "exists" | "downloadToLocal" | "uploadLocalFile">) {
  async function getDbFile({ dbId }: { dbId: string }) {
    const s3ObjectKey = dbIdToS3Key(dbId);
    const localDbFile = tempy.file({ extension: ".db" });
    const hasOldData = await exists({ s3ObjectKey });
    if (hasOldData) {
      await downloadToLocal({
        s3ObjectKey,
        localFile: localDbFile,
      });
    }
    return { localDbFile, exists: hasOldData };
  }

  async function putDbFile({
    dbId,
    localDbFile,
  }: {
    dbId: string;
    localDbFile: string;
  }) {
    await uploadLocalFile({
      s3ObjectKey: dbIdToS3Key(dbId),
      localFile: localDbFile,
    });
  }

  const getDb = getSqliteDatabase({ getDbFile });
  const putDb = putSqliteDatabase({ putDbFile });
  const closeDb = closeSqliteDatabase();
  const withDb = withSqliteDatabase({
    getDb,
    putDb,
    closeDb,
  });
  return { getDb, putDb, withDb };
}
