import cacheOr from "./cacheOr";

export default function withCache<Args extends unknown[], ReturnType>({
  delegate,
  cacheKey,
}: {
  delegate: (...args: Args) => Promise<ReturnType>;
  cacheKey: (...args: Args) => string;
}): (...args: Args) => Promise<ReturnType> {
  return (...args: Args): Promise<ReturnType> =>
    cacheOr({
      cacheKey: cacheKey(...args),
      compute: async () => await delegate(...args),
    });
}
