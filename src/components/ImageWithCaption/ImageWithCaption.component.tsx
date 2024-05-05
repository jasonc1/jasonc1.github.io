import React from "react";
import { Text } from "../../components/text/text.component";
import { IImageWithCaptionProps } from "./ImageWithCaption.model";
import classNames from "classnames";
import "./ImageWithCaption.style.scss";

export const ImageWithCaption = ({
  caption,
  iphone = false,
  white = false,
  src,
}: IImageWithCaptionProps) => {
  const imgClass = classNames({
    "iphone-img": iphone,
    "white-background": white,
  });
  return (
    <div className="image-with-caption">
      <img src={src} className={imgClass} alt={caption} />
      <Text size="Body" text={caption} />
    </div>
  );
};

export default ImageWithCaption;
