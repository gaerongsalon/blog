import * as React from "react";

import styled from "styled-components";

const ImageSelectorDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 24vh;
  overflow-y: auto;
`;

const ImageSelectorImage = styled.img`
  max-width: calc(33% - 2rem);
  max-height: 20vh;
  padding: 1rem;
  object-fit: contain;
`;

export type OnImageClick = (image: string) => void;

export default function ImageSelector({
  images,
  onImageClick,
}: {
  images: string[];
  onImageClick: OnImageClick;
}) {
  return (
    <ImageSelectorDiv>
      {images.map((image) => (
        <ImageSelectorImage
          key={image}
          src={image}
          alt={image}
          onClick={() => onImageClick(image)}
        />
      ))}
    </ImageSelectorDiv>
  );
}
