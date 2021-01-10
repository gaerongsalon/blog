import * as React from "react";

import { DropZoneDiv } from "./ImageDropZone";
import ImageDropZone from "./ImageDropZone";
import ImageSelector from "./ImageSelector";
import LinkStyledButton from "./LinkStyledButton";
import { OnImageClick } from "./ImageSelector";
import mergeList from "../utils/mergeList";
import styled from "styled-components";

const ImageUploadPanelDiv = styled.div`
  border: 1px solid #dddddd;
  padding: 1rem;
  position: absolute;
  background-color: white;
  bottom: 0;
  left: 0;
  right: 18px;
`;

const HiddenImageUploadPanelDiv = styled(ImageUploadPanelDiv)`
  height: 24px;
`;

const ToggleButton = styled(LinkStyledButton)`
  float: right;
`;

export default function ImageUploadPanel({
  onImageClick,
}: {
  onImageClick: OnImageClick;
}) {
  const [hidden, setHidden] = React.useState<boolean>(true);
  const [images, setImages] = React.useState<string[]>([]);
  const updateImages = React.useCallback(
    function updateImages(result: string[]) {
      setImages((oldImages) => mergeList(oldImages, result));
      if (hidden) {
        setHidden(false);
      }
    },
    [setImages, hidden, setHidden]
  );
  const Div = hidden ? HiddenImageUploadPanelDiv : ImageUploadPanelDiv;
  return (
    <Div>
      <ToggleButton onClick={() => setHidden((value) => !value)}>
        {hidden ? "Show" : "Hide"}
      </ToggleButton>
      <ImageDropZone
        updateImages={updateImages}
        DropZoneComponent={
          <DropZoneDiv>CHOOSE IMAGE FILES ({images.length})</DropZoneDiv>
        }
        imageSize="lg"
      />
      <ImageSelector images={images} onImageClick={onImageClick} />
    </Div>
  );
}
