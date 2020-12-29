import React from 'react';
import { Text } from '../../components/text/text.component';
import { IImageWithCaptionProps } from './ImageWithCaption.model';
import './ImageWithCaption.style.scss';

export const ImageWithCaption = ({ caption, src }: IImageWithCaptionProps) => {
  return (
    <div className="image-with-caption">
      <img src={src} alt={caption} />
      <Text size="body-2" text={caption} />
    </div>
  );
};

export default ImageWithCaption;
