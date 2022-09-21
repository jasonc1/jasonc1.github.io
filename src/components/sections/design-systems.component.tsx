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

const Vesta = (
  <Link className="action-link" to="/Vesta" target="_blank">
    <Text size="link-1" text="Vesta" />
  </Link>
);

const Ink = (
  <a
    className="action-link"
    target="_blank"
    rel="noreferrer"
    href={'https://ink.carta.com/'}
  >
    <Text size="link-1" text="Ink design system" />
  </a>
);

const designSystemsDescription: JSX.Element = (
  <div>
    Design systems is currently my passion. In one way or another, I got my
    first taste of design systems while I was at Intuit, where I owned and
    contributed to an accordion component. Then, I moved to Blend, where I was a
    founding member of {AlchemyLink}, a themeable design system to support
    Blend’s various products. Before working on Alchemy, I helped create and
    maintain Figma libraries, write documentation, address design debt, and host
    UI reviews for our fellow product designers. Afterwards, I joined Carta to
    continue my work around {Ink} where I lead the "Ink on Figma" effort,
    contributed to Ink's codebase, and prototyped designs for the "Employee"
    (aka "Shareholder") pillar. I have also worked as a contractor for {Vesta},
    where I built out the whole design system from the ground up.
  </div>
);

// TODO add proper links to external pages ie stratroulette.com
export const DesignSystems = () => {
  return (
    <Subject title="Design Systems" description={designSystemsDescription}>
      <SubjectLinks
        projects={[
          {
            name: 'Alchemy Design System',
            link: 'Alchemy',
            external: false,
          },
          {
            name: 'Ink Design System',
            link: 'Ink',
            external: false,
          },
          {
            name: 'Vesta ui-kit',
            link: 'Vesta',
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
