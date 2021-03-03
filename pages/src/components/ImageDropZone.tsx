import * as React from "react";

import BeatLoader from "react-spinners/BeatLoader";
import { ImageSize } from "../apis/uploadImage";
import overlay from "../utils/overlay";
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
  imageSize = "all",
}: {
  maxFiles?: number;
  DragActiveComponent?: React.ReactElement;
  DropZoneComponent?: React.ReactElement;
  updateImages: (images: string[]) => unknown;
  imageSize: ImageSize;
}) {
  const [uploading, setUploading] = React.useState<boolean>(false);
  const onDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      if (uploading) {
        alert("Alreay uploading!");
        return;
      }
      overlay().show();
      setUploading(true);
      try {
        updateImages(
          await Promise.all(
            acceptedFiles.map((file) => uploadImage(file, imageSize))
          )
        );
      } finally {
        setUploading(false);
        overlay().hide();
      }
    },
    [updateImages, uploading, setUploading, imageSize]
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
