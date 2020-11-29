import metadata from "../metadata.json";

export default function formatWritten(written: string): string {
  return new Date(written)
    .toLocaleDateString(metadata.locale)
    .replace(/\. /g, "-")
    .replace(/\.$/, "");
}
