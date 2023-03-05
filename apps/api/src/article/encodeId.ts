export default function encodeId(input: string): string {
  return /[ㄱ-힣]/.test(input) ? encodeURIComponent(input) : input;
}
