import * as React from "react";

import uploadImage from "../apis/uploadImage";
import { useDropzone } from "react-dropzone";

export default function ImageDropZone({
  maxFiles,
  DragActiveComponent = <p>Drop the files here ...</p>,
  DropZoneComponent = (
    <p>Drag 'n' drop some files here, or click to select files</p>
  ),
  updateImages,
}: {
  maxFiles?: number;
  DragActiveComponent?: React.ReactElement;
  DropZoneComponent?: React.ReactElement;
  updateImages: (images: string[]) => unknown;
}) {
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      // Do something with the files
      Promise.all(acceptedFiles.map((file) => uploadImage(file))).then(
        updateImages
      );
    },
    [updateImages]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles,
    onDrop,
    accept: ["image/jpg", "image/jpeg", "image/png"],
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? DragActiveComponent : DropZoneComponent}
    </div>
  );
}
