import * as React from "react";

import ImageDropZone from "./ImageDropZone";
import ImageSelector from "./ImageSelector";
import { OnImageClick } from "./ImageSelector";
import mergeList from "../utils/mergeList";

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
    <div className="ImageUploadPanel">
      <ImageDropZone updateImages={updateImages} />
      <ImageSelector images={images} onImageClick={onImageClick} />
    </div>
  );
}
