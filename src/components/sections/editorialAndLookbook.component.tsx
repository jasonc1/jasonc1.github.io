import React from 'react';
import { Text } from '../text/text.component';
import { Subject } from '../subject/subject.component';
import { SubjectLinks } from '../subject-links/subject-links.component';

const RoninDivisionLink = (
  <a
    className="action-link"
    target="_blank"
    rel="noreferrer"
    href={'https://www.ronindivision.com/'}
  >
    <Text size="link-1" text="Ronin Division" />
  </a>
);

const editorialAndLookbookDescription: JSX.Element = (
  <div>
    If I’m not out on the streets or in nature lugging my tripod around, I
    occaisionally collaborate with my friend Brendan to work on photographing
    lookbooks and editorials for a streetwear brand called {RoninDivisionLink}.
    As someone that collects sneakers and enjoys streetwear, it’s always nice to
    participate and give back to the streetwear community.
  </div>
);

export const EditorialAndLookbook = () => {
  return (
    <Subject
      title="Editorial &amp; Lookbook"
      description={editorialAndLookbookDescription}
    >
      <SubjectLinks
        projects={[
          {
            name: 'Ronin Division FW20',
            link: 'https://www.ronindivision.com/pages/fall2020-lookbook',
            external: true,
          },
          {
            name: 'Ronin Division Face Mask (COVID-19)',
            link:
              'https://www.instagram.com/p/CC_gBc7pbT2/?utm_source=ig_web_copy_link',
            external: true,
          },
          {
            name: 'Ronin Division FW18',
            link: 'https://www.ronindivision.com/pages/fw18-lookbook',
            external: true,
          },
        ]}
      />
    </Subject>
  );
};

export default EditorialAndLookbook;
