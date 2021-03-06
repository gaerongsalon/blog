import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import "./quill/Video";

import * as React from "react";

import ImageUploadPanel from "./ImageUploadPanel";
import ReactQuill from "react-quill";
import formats from "./quill/formats";
import imagePaste from "./quill/imagePaste";
import modules from "./quill/modules";

export default function ArticleEditor({
  content,
  preview,
  updateValue,
}: {
  content?: string;
  preview: boolean;
  updateValue?: (newValue: string) => void;
}) {
  const [value, setValue] = React.useState(content ?? "");
  const quillRef = React.useRef<ReactQuill>(null);

  const addImage = React.useCallback(
    function (imageUrl: string) {
      const quill = quillRef.current?.getEditor();
      if (!quill) {
        return;
      }
      const range = quill.getSelection();
      quill.insertEmbed(range?.index ?? 0, "image", imageUrl);
      quill.focus();
    },
    [quillRef]
  );
  React.useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) {
      return;
    }
    imagePaste(quill);
  }, [quillRef]);
  return (
    <>
      <ReactQuill
        theme={preview ? "bubble" : "snow"}
        ref={quillRef}
        formats={formats}
        modules={modules}
        value={value}
        defaultValue={value}
        onChange={(newValue) => {
          setValue(newValue);
          if (updateValue) {
            updateValue(newValue);
          }
        }}
        readOnly={preview}
        scrollingContainer="#root"
      />
      {!preview ? <ImageUploadPanel onImageClick={addImage} /> : null}
    </>
  );
}
