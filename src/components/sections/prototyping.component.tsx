import React from 'react';
import { Text } from '../text/text.component';
import { Subject } from '../subject/subject.component';
import { Link } from 'react-router-dom';
import { SubjectLinks } from '../subject-links/subject-links.component';

const prototypingAtBlendLink = (
  <Link className="action-link" to="/PrototypingAtBlend" target="_blank">
    <Text size="link-1" text="here" />
  </Link>
);

const oneTapLink = (
  <a
    className="action-link"
    target="_blank"
    rel="noreferrer"
    href={'https://blend.com/one-tap/'}
  >
    <Text size="link-1" text="One Tap Mobile" />
  </a>
);

const prototypingDescription: JSX.Element = (
  <div>
    At Blend, I was fortunate enough to create a whole process around
    prototyping and make it a reality for Engineering, Product, and Design. A
    notable project would be {oneTapLink}, as I’ve been able to leverage the
    prototype for user studies, sales demos, and exploratory concepts to help
    product designers design faster. At Carta, I built roughly 1-2 prototypes
    each quarter for user testing as well as proof of concept testing, where I
    collaborated with designers to elevate their designs through providing
    feedback around ui/components, edge cases, and more.
  </div>
);

export const Prototyping = () => {
  return (
    <Subject title="Prototyping" description={prototypingDescription}>
      <SubjectLinks
        projects={[
          {
            name: 'One Tap Mobile (OTM)',
            link: 'OTM',
            external: false,
          },
          {
            name: 'Exercise Status',
            link: 'Exercise Status',
            external: false,
          },
          {
            name: 'Employee Onboarding',
            link: 'Employee Onboarding',
            external: false,
          },
          {
            name: 'Wait Task V2',
            link: 'WaitTaskV2',
            external: false,
          },
        ]}
      />
    </Subject>
  );
};

export default Prototyping;
