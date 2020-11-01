import * as React from "react";

import ImageSelector from "./ImageSelector";
import { OnImageClick } from "./ImageSelector";
import mergeList from "../utils/mergeList";
import uploadImage from "../apis/uploadImage";
import { useDropzone } from "react-dropzone";

export default function ImageUploadPanel({
  onImageClick,
}: {
  onImageClick: OnImageClick;
}) {
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

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      <ImageSelector images={images} onImageClick={onImageClick} />
    </>
  );
}
