import React from 'react';
import { Text } from '../text/text.component';
import { Subject } from '../subject/subject.component';
import { Link } from 'react-router-dom';
import { SubjectLinks } from '../subject-links/subject-links.component';

const prototypingAtBlendLink = (
  <Link className="action-link" to="/underconstruction">
    <Text size="link-1" text="here" />
  </Link>
);

const prototypingDescription: JSX.Element = (
  <div>
    At Blend, I was fortunate enough to create a whole process around
    prototyping and make it a reality for Engineering, Product, and Design. You
    can read more about my journey {prototypingAtBlendLink}. One Tap Mobile, is
    a project that I hold dear to my heart as I’ve been able to leverage the
    prototype for user studies, sales demos, and even just exploratory concepts
    to help product designers design faster. My high fidelity prototypes
    (especially in React) have seen to be useful for both design and
    engineering, as they serve as an addition to mocks.
  </div>
);

export const Prototyping = () => {
  return (
    <Subject title="Prototyping" description={prototypingDescription}>
      <SubjectLinks
        projects={[
          {
            name: 'One Tap Mobile (OTM)',
            link: 'underconstruction',
            external: false,
          },
          {
            name: 'Wait Task V2',
            link: 'underconstruction',
            external: false,
          },
        ]}
      />
    </Subject>
  );
};

export default Prototyping;
