import { Quill } from "react-quill";

const BlockEmbed = Quill.import("blots/block/embed");

class Video extends BlockEmbed {
  static create(value: string) {
    const node = super.create(value);
    const iframe = document.createElement("iframe");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute("src", value);
    node.appendChild(iframe);
    return node;
  }

  static value(domNode: HTMLElement) {
    if (domNode.tagName === "IFRAME") {
      return domNode.getAttribute("src");
    }
    return (domNode.firstChild as HTMLElement).getAttribute("src");
  }
}
Video.blotName = "video";
Video.className = "ql-video";
Video.tagName = "div";

Quill.register({
  "formats/video": Video,
});
