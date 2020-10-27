import React, { useEffect } from 'react';
import { Text } from '../../components/text/text.component';
import './nav.style.scss';
import { theme } from '../../colors.js';

export const Nav = () => {
  useEffect(() => {
    const handleScroll = () => {
      const navRate = window.scrollY / 20;
      const nav = document.getElementById('nav-selector');
      if (nav) {
        if (window.scrollY < 500) {
          nav.style.width = 50 - navRate + '%';
        } else {
          nav.style.width = '25%';
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const clickProjects = () => {
    document
      .getElementById('scroll-projects')
      ?.scrollIntoView({ behavior: 'smooth' });
  };
  const clickAbout = () => {
    document
      .getElementById('scroll-about')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="nav" id="nav-selector">
      <div className="nav-content">
        <Text size="display-1" color={theme.primary} text="Jason Chen" />

        <ul className="nav-menu">
          <li id="about" onClick={clickAbout}>
            <Text size="subheader-1" color={theme.primary} text="About" />
          </li>
          <li id="projects" onClick={clickProjects}>
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
