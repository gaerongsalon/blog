import * as React from "react";

import uploadImage from "../apis/uploadImage";
import { useDropzone } from "react-dropzone";

export default function ImageDropZone({
  maxFiles,
  DropZoneComponent = <div className="DropZone">CHOOSE IMAGE FILES</div>,
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
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles,
    onDrop,
    accept: ["image/jpg", "image/jpeg", "image/png"],
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {DropZoneComponent}
    </div>
  );
}
