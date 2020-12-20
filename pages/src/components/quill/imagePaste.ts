import Delta from "quill-delta";
import { Quill } from "react-quill";
import base64ImageToBlob from "../../utils/base64ImageToBlob";
import handleError from "../../utils/handleError";
import uploadImage from "../../apis/uploadImage";

export default function imagePaste(quill: Quill) {
  quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) =>
    handlePastedImage(quill, node, delta)
  );
}

function handlePastedImage(
  quill: Quill,
  node: HTMLElement,
  delta: unknown
): any {
  if (node.tagName !== "IMG") {
    return delta;
  }
  const imageElement = node as HTMLImageElement;
  const imageSource = imageElement.src;
  if (!imageSource || !imageSource.startsWith("data:")) {
    return delta;
  }

  const blob = base64ImageToBlob(imageSource);
  uploadImage(blob)
    .then((imageUrl) => {
      // Insert new image after uploaded.
      quill.updateContents(new Delta().insert({ image: imageUrl }) as any);
    })
    .catch(handleError);

  // Do nothing until image uploaded.
  return new Delta();
}
