export default function trimTags(input: string): string {
  return (
    "," +
    (input ?? "")
      .trim()
      .split(",")
      .map((tag) => tag.trim())
      .join(",") +
    ","
  );
}
