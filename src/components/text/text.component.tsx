import React from 'react';
import { ITextProps, ITextStyles } from './text.model';
import './text.style.scss';
import classNames from 'classnames';

export const Text = ({
  textAlign = 'left',
  color = 'inherit',
  size,
  text,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
}: ITextProps) => {
  const textStyles: ITextStyles = {
    textAlign,
    color,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
  };

  const textClass = classNames('text', {
    'display-1': size === 'display-1',
    'display-2': size === 'display-2',
    'header-1': size === 'header-1',
    'subheader-1': size === 'subheader-1',
    'body-1': size === 'body-1',
    'body-2': size === 'body-2',
    'link-1': size === 'link-1',
    'link-2': size === 'link-2',
  });

  return (
    <div className={textClass} style={textStyles}>
      {text}
    </div>
  );
};
