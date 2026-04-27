import Delta from "quill-delta";
import type ReactQuill from "react-quill-new";
import base64ImageToBlob from "../../utils/base64ImageToBlob";
import handleError from "../../utils/handleError";
import overlay from "../../utils/overlay";
import uploadImage from "../../apis/uploadImage";

type QuillEditor = ReturnType<ReactQuill["getEditor"]>;

export default function imagePaste(quill: QuillEditor) {
  quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node: Node, delta: Delta) =>
    handlePastedImage(quill, node, delta),
  );
}

function handlePastedImage(
  quill: QuillEditor,
  node: Node,
  delta: Delta,
): Delta {
  if (!(node instanceof HTMLImageElement)) {
    return delta;
  }
  const imageSource = node.src;
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
            .insert({ image: imageUrl }) as any,
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
