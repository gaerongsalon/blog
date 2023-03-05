export default function trimTags(input: string): string {
  return input
    .split(/,/g)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .join(", ");
}
