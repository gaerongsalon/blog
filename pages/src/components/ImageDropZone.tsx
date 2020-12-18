import * as React from "react";

import { BeatLoader } from "react-spinners";
import styled from "styled-components";
import uploadImage from "../apis/uploadImage";
import { useDropzone } from "react-dropzone";

export const DropZoneDiv = styled.div`
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
  const [uploading, setUploading] = React.useState<boolean>(false);
  const onDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      if (uploading) {
        alert("Alreay uploading!");
        return;
      }
      setUploading(true);
      try {
        // Do something with the files
        const result: string[] = [];
        for (const file of acceptedFiles) {
          result.push(await uploadImage(file));
        }
        updateImages(result);
      } finally {
        setUploading(false);
      }
    },
    [updateImages, uploading, setUploading]
  );
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles,
    onDrop,
    accept: ["image/jpg", "image/jpeg", "image/png"],
  });

  return uploading ? (
    <BeatLoader />
  ) : (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {DropZoneComponent}
    </div>
  );
}
