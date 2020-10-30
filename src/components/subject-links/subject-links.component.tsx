import React from 'react';
import { ISubjectLinksProps } from './subject-links.model';
import './subject-links.style.scss';
import { Text } from '../text/text.component';
import { theme } from '../../colors.js';
import { Link } from 'react-router-dom';

export const SubjectLinks = ({ projects }: ISubjectLinksProps) => {
  return (
    <div className="subject-links">
      {projects.map((project) => {
        console.log(project);
        if (project.link) {
          return (
            <Link className="link" to={project.link}>
              <Text size="link-1" color={theme.accent} text={project.name} />
            </Link>
          );
        } else {
          return (
            <Text size="link-1" color={theme.accent} text={project.name} />
          );
        }
      })}
    </div>
  );
};
