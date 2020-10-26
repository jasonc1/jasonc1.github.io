import React from 'react';
import { Text } from '../../components/text/text.component';
import './nav.style.scss';
import { theme } from '../../colors.js';

const headerText = 'Jason Chen';

export const Nav = () => {
  return (
    <div className="nav">
      <div className="nav-content">
        <Text size="display-1" color={theme.primary} text="Jason Chen" />

        <ul className="nav-menu">
          <li id="about">
            <Text size="subheader-1" color={theme.primary} text="About" />
          </li>
          <li id="projects">
            <Text size="subheader-1" color={theme.primary} text="Projects" />
          </li>
          <li id="photography">
            <Text size="subheader-1" color={theme.primary} text="Photography" />
          </li>
          <li id="resume">
            <Text size="subheader-1" color={theme.primary} text="Resume" />
          </li>
        </ul>
      </div>
    </div>
  );
};
