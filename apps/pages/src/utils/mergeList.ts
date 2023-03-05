export default function mergeList<T>(past: T[], now: T[]): T[] {
  const result: T[] = [...past];
  now.forEach((each) => {
    if (!result.includes(each)) {
      result.push(each);
    }
  });
  return result;
}
