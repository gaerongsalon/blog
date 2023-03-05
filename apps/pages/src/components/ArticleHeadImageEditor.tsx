import { LabelInputDiv, StyledLabel } from "./LabelInput";

import ImageDropZone from "./ImageDropZone";
import styled from "styled-components";

const HeadDiv = styled.div`
  width: calc(100% - 16px);
  display: block;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  padding: 6px;
  border: 1px solid #dddddd;
`;

const HeadImg = styled.img`
  width: calc(100% - 16px);
  display: block;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  padding: 6px;
  border: 1px solid #dddddd;
  width: auto;
  max-width: 50vw;
`;

export default function ArticleHeadImageEditor({
  headImage,
  updateHeadImage,
}: {
  headImage: string;
  updateHeadImage: (images: string[]) => void;
}) {
  return (
    <ImageDropZone
      updateImages={updateHeadImage}
      maxFiles={1}
      DropZoneComponent={
        headImage ? (
          <LabelInputDiv>
            <StyledLabel>Head Image</StyledLabel>
            <HeadImg src={headImage} alt="Head" />
          </LabelInputDiv>
        ) : (
          <LabelInputDiv>
            <StyledLabel>Head Image</StyledLabel>
            <HeadDiv>CHOOSE AN IMAGE</HeadDiv>
          </LabelInputDiv>
        )
      }
      imageSize="all"
    />
  );
}
