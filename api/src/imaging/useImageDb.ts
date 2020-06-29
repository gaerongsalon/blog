import { UseS3 } from "../aws/useS3";
import useRedisLock from "../redis/useRedisLock";
import useS3JsonDb from "../jsondb/useS3JsonDb";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function useImageDb({
  dbKey = "db/optimized-images",
  dbRedisLock = "blog:lock:optimized-images",
  exists,
  getJSON,
  putJSON,
}: {
  dbKey?: string;
  dbRedisLock?: string;
} & Pick<UseS3, "exists" | "getJSON" | "putJSON">) {
  const { inLock } = useRedisLock();
  const { getDb, editDb } = useS3JsonDb({ exists, getJSON, putJSON });

  async function checkExists({
    imageKeys,
  }: {
    imageKeys: string[];
  }): Promise<boolean> {
    const images =
      ((await inLock(getDb, {
        lockRedisKey: dbRedisLock,
      })({ dbId: dbKey })) as string[]) ?? [];
    return imageKeys.every((imageKey) => images.includes(imageKey));
  }

  async function add({ imageKeys }: { imageKeys: string[] }): Promise<void> {
    await inLock(editDb, { lockRedisKey: dbRedisLock })({
      dbId: dbKey,
      doIn: async (images: string[] | null) => {
        return [...new Set([...(images ?? []), ...imageKeys])].sort((a, b) =>
          a.localeCompare(b)
        );
      },
    });
  }

  return { checkExists, add };
}
