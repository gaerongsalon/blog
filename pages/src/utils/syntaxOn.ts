export default function syntaxOn() {
  document.querySelectorAll("pre").forEach((block) => {
    (window as any).hljs.highlightBlock(block);
  });
}
