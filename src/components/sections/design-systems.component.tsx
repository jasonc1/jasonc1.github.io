import React from 'react';
import { Text } from '../../components/text/text.component';
import { theme } from '../../colors.js';
import { Subject } from '../../components/subject/subject.component';
import { Link } from 'react-router-dom';
import { SubjectLinks } from '../../components/subject-links/subject-links.component';

const intuitAccordionLink = (
  <Link className="action-link" to="/accordion">
    <Text size="link-1" text="accordion" />
  </Link>
);

const AlchemyLink = (
  <Link className="action-link" to="/alchemy">
    <Text size="link-1" text="Alchemy Design systmes" />
  </Link>
);

const designSystemsAtBlendLink = (
  <Link className="action-link" to="/designSystemsAtBlend">
    <Text size="link-1" text="here" />
  </Link>
);

const StratRouletteLink = (
  <Link className="action-link" to="/sr">
    <Text size="link-1" text="StratRoulette" />
  </Link>
);

const designSystemsDescription: JSX.Element = (
  <div>
    Design systems is currently my passion. In one way or another, I got my
    first taste of design systems while I was at Intuit, where I owned and
    contributed to an {intuitAccordionLink} component. Then, I moved to Blend,
    where I helped bring forth to light {AlchemyLink}, a themeable design system
    to support Blend’s various products. Before working on Alchemy, I helped
    create and maintain Figma libraries, write documentation, address design
    debt, and host UI reviews for our fellow product designers. You can read
    more about my journey to design systems {designSystemsAtBlendLink}. On the
    side, I work on a side project called {StratRouletteLink} where I’ve led the
    design systems effort by designing and coding the UI library and several
    main features of the application.
  </div>
);

export const DesignSystems = () => {
  return (
    <Subject title="Design Systems" description={designSystemsDescription}>
      <SubjectLinks
        projects={[
          { name: 'Alchemy', link: '/alchemy' },
          { name: 'StratRoulette', link: 'sr' },
          { name: 'Intuit Design Systems Accordion', link: 'accordion' },
        ]}
      />
    </Subject>
  );
};
