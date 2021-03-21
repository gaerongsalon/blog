import S3 from "../aws/S3";
import secrets from "@config/secrets.json";
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
} & Pick<S3, "exists" | "getJSON" | "putJSON">) {
  const { inLock } = useRedisLock(secrets.redis);
  const { getDb, editDb } = useS3JsonDb({ exists, getJSON, putJSON });

  async function checkExists({
    imageKeys,
  }: {
    imageKeys: string[];
  }): Promise<boolean> {
    const images = ((await getDb({ dbId: dbKey })) as string[]) ?? [];
    return imageKeys.every((imageKey) => images.includes(imageKey));
  }

  async function add({ imageKeys }: { imageKeys: string[] }): Promise<void> {
    await inLock(editDb, {
      lockRedisKey: dbRedisLock,
      expiredMillis: 3 * 1000, // S3 can be very slow.
    })({
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
