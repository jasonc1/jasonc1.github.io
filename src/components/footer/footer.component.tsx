import React from 'react';
import { IFooterProps, IFooterStyles } from './footer.model';
import './footer.style.scss';
import { Text } from '../text/text.component';

export const Footer = ({
  color = 'inherit',
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
}: IFooterProps) => {
  const textStyles: IFooterStyles = {
    color,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
  };

  return (
    <footer style={textStyles}>
      <Text
        size="body-2"
        color={color}
        text="Created in React &amp; designed with Figma"
        marginBottom={0}
      />

      <Text
        size="body-2"
        color={color}
        text="&copy; JASON CHEN 2020"
        marginBottom={0}
      />
    </footer>
  );
};
