import React from 'react';
import { Text } from '../../components/text/text.component';
import './UnderConstruction.style.scss';
import { theme } from '../../colors.js';

const headline = 'Under Construction!';
const blurb =
  "I'm currently working on this part of my portfolio, and this content is not yet ready. If you want to chat specifically about a certain topic, please contact me!";

export const UnderConstruction = () => {
  return (
    <div className="under-construction">
      <div className="under-construction-content">
        <Text
          size="display-1"
          color={theme.accent}
          text={headline}
          marginBottom={16}
        />
        <Text
          size="body-1"
          color={theme.accent}
          text={blurb}
          marginBottom={16}
        />
      </div>
    </div>
  );
};

export default UnderConstruction;
