import loadSyntaxModule from "./loadSyntaxModule";

export default function syntaxOn() {
  loadSyntaxModule().then(() => {
    // Syntax highlight after script loaded.
    document.querySelectorAll("pre").forEach((block) => {
      (window as any).hljs.highlightBlock(block);
    });
  });
}
