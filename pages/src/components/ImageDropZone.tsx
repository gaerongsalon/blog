import * as React from "react";

import styled from "styled-components";
import uploadImage from "../apis/uploadImage";
import { useDropzone } from "react-dropzone";

const DropZoneDiv = styled.div`
  font-weight: bold;
  margin-bottom: 1rem;
`;

export default function ImageDropZone({
  maxFiles,
  DropZoneComponent = <DropZoneDiv>CHOOSE IMAGE FILES</DropZoneDiv>,
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
