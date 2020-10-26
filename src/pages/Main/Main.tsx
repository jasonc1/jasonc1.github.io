import React from 'react';
import { Text } from '../../components/text/text.component';
import './main.style.scss';
import { theme } from '../../colors.js';
import { Nav } from '../../components/nav/nav.component';

const headline = "I'll be back shortly!";
const blurb =
  'My portfolio is currently under construction. Please come back soon.';

export const Main = () => {
  return (
    <div className="main">
      <Nav />
      <div className="about">
        <Text
          size="body-1"
          color={theme.accent}
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum"
        />
      </div>
    </div>
  );
};
