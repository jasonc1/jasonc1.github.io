import React from 'react';
import { Text } from '../../components/text/text.component';
import './main.scss';
import { theme } from '../../colors.js';

const headline = "I'll be back shortly!";
const blurb =
  'My portfolio is currently under construction. Please come back soon.';

export const Main = () => {
  console.log(theme);
  return (
    <div className="main">
      <div className="content">
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
