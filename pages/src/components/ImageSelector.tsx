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
    <div className="ImageSelector">
      {images.map((image) => (
        <img
          key={image}
          src={image}
          alt={image}
          onClick={() => onImageClick(image)}
        />
      ))}
    </div>
  );
}
