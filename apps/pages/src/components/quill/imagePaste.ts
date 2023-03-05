import Delta from "quill-delta";
import { Quill } from "quill";
import base64ImageToBlob from "../../utils/base64ImageToBlob";
import handleError from "../../utils/handleError";
import overlay from "../../utils/overlay";
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

  const ov = overlay();
  ov.show();
  try {
    const blob = base64ImageToBlob(imageSource);
    uploadImage(blob)
      .then((imageUrl) => {
        // Insert new image after uploaded.
        quill.updateContents(
          new Delta()
            .retain(quill.getSelection()?.index ?? 1)
            .insert({ image: imageUrl }) as any
        );
      })
      .catch(handleError)
      .finally(() => ov.hide());
  } catch (error: any) {
    handleError(error);
    ov.hide();
  }

  // Do nothing until image uploaded.
  return new Delta();
}
