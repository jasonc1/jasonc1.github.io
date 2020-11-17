import React from 'react';
import { Text } from '../text/text.component';
import { Subject } from '../subject/subject.component';
import { Link } from 'react-router-dom';
import { SubjectLinks } from '../subject-links/subject-links.component';

const saplingLink = (
  <Link className="action-link" to="/underconstruction" target="_blank">
    <Text size="link-1" text="Sapling" />
  </Link>
);

const toolsAndOpsDescription: JSX.Element = (
  <div>
    At Blend, I’ve also been fortunate enough to help with design ops and create
    tooling to help product designers do their best work. To do this, I’ve found
    that I’ve been able to use my programming knowledge to create small programs
    or Figma plugins. {saplingLink}, for example, helps product designers
    organize their pages within figma so their cross functional partners can
    better reference screens to foster easier collaboration. Furthermore, I’ve
    been able to help educate and consult with product designers for any
    component help they need via UI reviews at Blend.
  </div>
);

export const ToolsAndOps = () => {
  return (
    <Subject
      title="Web Tools &amp; Design Ops"
      description={toolsAndOpsDescription}
    >
      <SubjectLinks
        projects={[
          {
            name: 'Sapling',
            link: 'underconstruction',
            external: false,
          },
          {
            name: 'StratRoulette',
            link: 'underconstruction',
            external: false,
          },
          {
            name: 'Intuit Design Systems Accordion',
            link: 'underconstruction',
            external: false,
          },
        ]}
      />
    </Subject>
  );
};

export default ToolsAndOps;
