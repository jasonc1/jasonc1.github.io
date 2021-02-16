import React from 'react';
import { Text } from '../text/text.component';
import { Subject } from '../subject/subject.component';
import { Link } from 'react-router-dom';
import { SubjectLinks } from '../subject-links/subject-links.component';

// TODO add proper links to project pages

const AlchemyLink = (
  <Link className="action-link" to="/underconstruction" target="_blank">
    <Text size="link-1" text="Alchemy Design system" />
  </Link>
);

const designSystemsAtBlendLink = (
  <Link className="action-link" to="/DesignSystemsAtBlend" target="_blank">
    <Text size="link-1" text="here" />
  </Link>
);

const StratRouletteLink = (
  <a
    className="action-link"
    target="_blank"
    rel="noreferrer"
    href={'https://www.stratroulette.com'}
  >
    <Text size="link-1" text="StratRoulette" />
  </a>
);

const designSystemsDescription: JSX.Element = (
  <div>
    Design systems is currently my passion. In one way or another, I got my
    first taste of design systems while I was at Intuit, where I owned and
    contributed to an accordion component. Then, I moved to Blend, where I
    helped bring forth to light {AlchemyLink}, a themeable design system to
    support Blend’s various products. Before working on Alchemy, I helped create
    and maintain Figma libraries, write documentation, address design debt, and
    host UI reviews for our fellow product designers. You can read more about my
    journey to design systems {designSystemsAtBlendLink}. On the side, I work on
    a side project called {StratRouletteLink} where I’ve led the design systems
    effort by designing and coding the UI library and several main features of
    the application.
  </div>
);

// TODO add proper links to external pages ie stratroulette.com
export const DesignSystems = () => {
  return (
    <Subject title="Design Systems" description={designSystemsDescription}>
      <SubjectLinks
        projects={[
          {
            name: 'Alchemy',
            link: 'underconstruction',
            external: false,
          },
          {
            name: 'StratRoulette',
            link: 'StratRoulette',
            external: false,
          },
          {
            name: 'Intuit Design Systems Accordion',
            link: 'IDSAccordion',
            external: false,
          },
        ]}
      />
    </Subject>
  );
};

export default DesignSystems;
