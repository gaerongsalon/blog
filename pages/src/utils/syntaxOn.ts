export default function syntaxOn() {
  // Insert stylesheet.
  const style = document.createElement("link");
  style.href =
    "//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.4.1/styles/night-owl.min.css";
  style.rel = "stylesheet";
  document.head.appendChild(style);

  // Insert JavaScript.
  const script = document.createElement("script");
  script.src =
    "//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.4.1/highlight.min.js";
  script.onload = function () {
    // Syntax highlight after script loaded.
    document.querySelectorAll("pre").forEach((block) => {
      (window as any).hljs.highlightBlock(block);
    });
  };
  document.head.append(script);

  return function () {
    // Clear resources.
    document.head.removeChild(style);
    document.head.removeChild(script);
  };
}
