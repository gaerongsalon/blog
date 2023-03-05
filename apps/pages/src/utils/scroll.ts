export default function scroll({ key }: { key: string }) {
  const scrollElement = document.getElementById("root");

  function top() {
    scrollElement?.scrollTo(0, 0);
  }

  function capture() {
    localStorage.setItem(key, `${scrollElement?.scrollTop ?? 0}`);
  }

  function restore() {
    const y = +(localStorage.getItem(key) ?? "0");
    scrollElement?.scrollTo(0, y);
  }

  function reset() {
    localStorage.removeItem(key);
  }

  return { top, capture, restore, reset };
}
