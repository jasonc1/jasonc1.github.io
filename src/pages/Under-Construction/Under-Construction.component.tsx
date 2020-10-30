import React from 'react';
import { Text } from '../../components/text/text.component';
import './Under-Construction.style.scss';
import { theme } from '../../colors.js';

const headline = 'Under Construction';
const blurb =
  "I'm currently working on this part of my portfolio. Please come back soon! If you want to chat specifically about a certain topic, please contact me directly in the meantime!";

export const UnderConstruction = () => {
  return (
    <div className="under-construction">
      <div className="under-construction-content">
        <Text
          size="display-1"
          color={theme.accent}
          text={headline}
          marginBottom={8}
        />
        <Text size="body-1" color={theme.accent} text={blurb} />
      </div>
    </div>
  );
};

export default UnderConstruction;
