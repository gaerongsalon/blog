import S3 from "../aws/S3";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function useS3JsonDb({
  dbIdToS3Key = (dbId: string) => `jsondb/${dbId}.json`,
  exists,
  getJSON,
  putJSON,
}: {
  dbIdToS3Key?: (dbId: string) => string;
} & Pick<S3, "exists" | "getJSON" | "putJSON">) {
  async function getDb<T>({ dbId }: { dbId: string }): Promise<T | null> {
    if (await exists({ s3ObjectKey: dbIdToS3Key(dbId) })) {
      return await getJSON<T>({ s3ObjectKey: dbIdToS3Key(dbId) });
    }
    return null;
  }

  async function putDb<T>({
    dbId,
    value,
  }: {
    dbId: string;
    value: T;
  }): Promise<void> {
    await putJSON<T>({ s3ObjectKey: dbIdToS3Key(dbId), value });
  }

  async function editDb<T>({
    dbId,
    doIn,
  }: {
    dbId: string;
    doIn: (value: T | null) => Promise<T>;
  }): Promise<void> {
    const value = await getDb<T>({ dbId });
    const nextValue = await doIn(value);
    await putDb({ dbId, value: nextValue });
  }

  return { getDb, putDb, editDb };
}
