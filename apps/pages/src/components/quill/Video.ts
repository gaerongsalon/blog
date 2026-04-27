import { Quill } from "react-quill-new";

type BlockEmbedConstructor = {
  new (...args: any[]): {
    domNode: HTMLElement;
  };
  create(value: string): HTMLElement;
};

const BlockEmbed = Quill.import(
  "blots/block/embed",
) as BlockEmbedConstructor;

class Video extends BlockEmbed {
  static blotName = "video";
  static className = "ql-video";
  static tagName = "div";

  static create(value: string) {
    const node = super.create(value) as HTMLElement;
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

Quill.register(
  {
    "formats/video": Video,
  },
  true,
);
