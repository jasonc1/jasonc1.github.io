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
          if (project.external) {
            return (
              <div className="project-link">
                <a target="_blank" rel="noreferrer" href={project.link}>
                  <Text
                    size="link-1"
                    color={theme.accent}
                    text={project.name}
                  />
                </a>
              </div>
            );
          } else {
            return (
              <div className="project-link">
                <Link to={project.link as string} target="_blank">
                  <Text
                    size="link-1"
                    color={theme.accent}
                    text={project.name}
                  />
                </Link>
              </div>
            );
          }
        } else {
          return (
            <Text size="link-1" color={theme.accent} text={project.name} />
          );
        }
      })}
    </div>
  );
};
