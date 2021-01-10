export default function decodeId(input: string): string {
  return /%E[B-D]/.test(input) ? decodeURIComponent(input) : input;
}
