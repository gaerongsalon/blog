import * as React from "react";

import ImageDropZone from "./ImageDropZone";
import ImageSelector from "./ImageSelector";
import { OnImageClick } from "./ImageSelector";
import mergeList from "../utils/mergeList";
import styled from "styled-components";

const ImageUploadPanelDiv = styled.div`
  margin: 2rem 0rem;
  border: 1px solid #dddddd;
  padding: 1rem;
`;

export default function ImageUploadPanel({
  onImageClick,
}: {
  onImageClick: OnImageClick;
}) {
  const [images, setImages] = React.useState<string[]>([]);
  const updateImages = React.useCallback(
    function updateImages(result: string[]) {
      setImages((oldImages) => mergeList(oldImages, result));
    },
    [setImages]
  );
  return (
    <ImageUploadPanelDiv>
      <ImageDropZone updateImages={updateImages} />
      <ImageSelector images={images} onImageClick={onImageClick} />
    </ImageUploadPanelDiv>
  );
}
