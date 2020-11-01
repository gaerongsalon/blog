import * as React from "react";

export type OnImageClick = (image: string) => void;

export default function ImageSelector({
  images,
  onImageClick,
}: {
  images: string[];
  onImageClick: OnImageClick;
}) {
  return (
    <div>
      {images.map((image) => (
        <img
          key={image}
          src={image}
          alt={image}
          style={{ width: 400 }}
          onClick={() => onImageClick(image)}
        />
      ))}
    </div>
  );
}
