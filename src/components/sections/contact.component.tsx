import React from 'react';
import { Subject } from '../subject/subject.component';
import { SubjectLinks } from '../subject-links/subject-links.component';
import Resume from '../../assets/misc/jason_chen_resume_2020.pdf';

const contactDescription: JSX.Element = (
  <div>
    Want to learn more about my journey? Feel free to reach out! I’m always open
    to talking to others about my role or even helping others figure out if
    design technology is something they want to do. Maybe you just want to talk
    about photography or sneakers - I’m always down for a chat over zoom or
    coffee.
  </div>
);

export const Contact = () => {
  return (
    <Subject title="Contact" description={contactDescription}>
      <SubjectLinks
        projects={[
          {
            name: 'Email',
            link: 'mailto:jasonc1@alumni.cmu.edu',
            external: true,
          },
          {
            name: 'LinkedIn',
            link: 'https://www.linkedin.com/in/jchen10/',
            external: true,
          },
          {
            name: 'Resume',
            link: Resume,
            external: true,
          },
          {
            name: 'Github',
            link: 'https://github.com/jasonc1',
            external: true,
          },
        ]}
      />
    </Subject>
  );
};

export default Contact;
