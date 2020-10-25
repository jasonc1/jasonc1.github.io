import React from 'react';
import { Text } from '../../components/text/text.component';
import './main.scss';
import theme from '../../theme.scss';

export const Main = () => {
  console.log(theme);
  return (
    <div className="main">
      <Text
        size="display-1"
        color={theme.accent}
        text={'Under Construction!'}
        marginBottom={8}
      />
      <Text
        size="body-1"
        color={theme.accent}
        text={'Please come back soon.'}
      />
    </div>
  );
};
