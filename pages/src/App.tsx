import "./App.css";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

import { compress, decompress } from "lzutf8";

import React from "react";
import ReactQuill from "react-quill";
import { useDropzone } from "react-dropzone";

const modules = {
  toolbar: {
    container: [
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ size: ["small", false, "large", "huge"] }, { color: [] }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
        { align: [] },
      ],
      ["link", "video"],
      ["clean"],
    ],
    handlers: { video: console.log },
  },
  clipboard: { matchVisual: false },
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "size",
  "color",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "align",
];

async function uploadImage(file: File): Promise<string> {
  console.log(file);
  const ext = file.name.substring(file.name.lastIndexOf("."));
  const uploadTarget: { uploadKey: string; url: string } = await fetch(
    `/api/image/upload?type=${ext}`
  ).then((r) => r.json());
  console.log(uploadTarget);

  const imageUploaded = await fetch(uploadTarget.url, {
    method: "PUT",
    body: file,
  }).then((r) => r.text());
  console.log(imageUploaded);

  const processed: {
    imageKey: string;
    desiredWidths: number[];
  } = await fetch(`/api/image/${uploadTarget.uploadKey}`, {
    method: "POST",
  }).then((r) => r.json());
  console.log(processed);
  return `/image/${processed.imageKey}?w=${processed.desiredWidths[0]}`;
}

function mergeList<T>(past: T[], now: T[]): T[] {
  const result: T[] = [...past];
  now.forEach((each) => {
    if (!result.includes(each)) {
      result.push(each);
    }
  });
  return result;
}

function App() {
  const [preview, setPreview] = React.useState(false);
  const [value, setValue] = React.useState("");
  const quillRef = React.useRef<ReactQuill>(null);
  const [images, setImages] = React.useState<string[]>([]);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    Promise.all(acceptedFiles.map((file) => uploadImage(file))).then((result) =>
      setImages((oldImages) => mergeList(oldImages, result))
    );
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ["image/jpg", "image/jpeg", "image/png"],
  });

  React.useEffect(() => {
    const url = window.location.href;
    if (url.includes("#")) {
      const encoded = url.substring(url.indexOf("#") + 1);
      setValue(decompress(encoded, { inputEncoding: "Base64" }));
    }
  }, []);

  const addText = React.useCallback(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) {
      return;
    }
    const range = quill.getSelection();
    quill.insertText(range?.index ?? 0, "안녕하쇼");
    // quill.setSelection((range?.index ?? 0) + 1);
    quill.focus();
  }, [quillRef]);
  const addImage = React.useCallback(
    (imageUrl: string) => {
      const quill = quillRef.current?.getEditor();
      if (!quill) {
        return;
      }
      console.log(imageUrl);
      const range = quill.getSelection();
      quill.insertEmbed(range?.index ?? 0, "image", imageUrl);
      // quill.insertText(range?.index ?? 0, "안녕하쇼");
      // quill.setSelection((range?.index ?? 0) + 1);
      quill.focus();
    },
    [quillRef]
  );

  return (
    <div className="App">
      <button onClick={() => setPreview(!preview)}>Toggle Preview</button>
      <button onClick={addText}>Say hello</button>
      <button
        onClick={() =>
          (window.location.href =
            "#" + compress(value, { outputEncoding: "Base64" }))
        }
      >
        Share
      </button>
      <ReactQuill
        theme={preview ? "bubble" : "snow"}
        ref={quillRef}
        formats={formats}
        modules={modules}
        value={value}
        onChange={setValue}
        readOnly={preview}
      />
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      <div>
        {images.map((image) => (
          <img
            key={image}
            src={image}
            alt={image}
            style={{ width: 400 }}
            onClick={() => addImage(image)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
