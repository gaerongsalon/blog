export default function loadSyntaxModule(): Promise<void> {
  const headNodes = [...document.head.childNodes.values()] as HTMLElement[];

  // Insert stylesheet.
  const hasCss = headNodes
    .filter((n) => n.tagName === "LINK")
    .some((n) =>
      ((n as HTMLLinkElement).href ?? "").includes("night-owl.min.css")
    );
  console.info({ hasCss });
  if (!hasCss) {
    const style = document.createElement("link");
    style.href =
      "//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.4.1/styles/night-owl.min.css";
    style.rel = "stylesheet";
    document.head.appendChild(style);
  }

  // Insert JavaScript.
  const hasJavaScript = headNodes
    .filter((n) => n.tagName === "SCRIPT")
    .some((n) =>
      ((n as HTMLScriptElement).src ?? "").includes("highlight.min.js")
    );
  console.info({ hasJavaScript });
  if (!hasJavaScript) {
    const script = document.createElement("script");
    script.src =
      "//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.4.1/highlight.min.js";
    document.head.appendChild(script);
    return new Promise<void>((resolve, reject) => {
      script.onload = function () {
        resolve();
      };
      script.onerror = reject;
    });
  }
  return Promise.resolve();
}
