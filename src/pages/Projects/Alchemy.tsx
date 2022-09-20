import React from 'react';
import Projects from '../../components/templates/prose/prose.component';
import { List } from '../../components/list/list.component';
import { ImageWithCaption } from '../../components/ImageWithCaption/ImageWithCaption.component';
import Alchemy_cover from '../../assets/images/projects/Alchemy/Alchemy_cover.png';
import Alchemy_foundations from '../../assets/images/projects/Alchemy/Alchemy_foundations.png';
import Alchemy_theming from '../../assets/images/projects/Alchemy/Alchemy_theming.png';
import Alchemy_checkbox from '../../assets/images/projects/Alchemy/Alchemy_checkbox.png';
import Alchemy_reference_site_color from '../../assets/images/projects/Alchemy/Alchemy_reference_site_color.svg';
import Alchemy_reference_site_component from '../../assets/images/projects/Alchemy/Alchemy_reference_site_component.svg';
import Alchemy_theme_object from '../../assets/images/projects/Alchemy/Alchemy_theme_object.png';
import Alchemy_icons_example from '../../assets/images/projects/Alchemy/Alchemy_icons_example.png';

import Checkbox_documentation from '../../assets/images/projects/Alchemy/Checkbox_documentation.pdf';
import { Text } from '../../components/text/text.component';

export const Alchemy = () => {
  const componentDocumentation = (
    <a
      className="action-link"
      target="_blank"
      rel="noreferrer"
      href={Checkbox_documentation}
    >
      <Text size="link-1" text="component documentation" />
    </a>
  );

  const summaryText = (
    <div>
      <ImageWithCaption
        white
        src={Alchemy_cover}
        caption="Alchemy brand logo"
      />
      Alchemy design system is an ongoing design system effort at Blend to
      create a unified design system that can be extensively customized and
      themed to be utilized in Blend’s various product families. Alchemy is the
      product of numerous attempts to establish design systems at Blend, thus
      leveraging all of Blend’s learnings and past attempts. Alchemy’s main goal
      is to act as one sole component library that both enterprise and consumer
      products can use to design and build with. The Alchemy design system is
      unique due to the fact that it takes on a “system for systems” approach
      since it leverages theming in order to produce visually distinct and
      unique components that basically act as one to many design systems.
    </div>
  );

  const AlchemyContent = [
    {
      section: 'Responsibilities',
      content: [
        <List
          size="body-1"
          listItems={[
            'Designed components with theming and accessibility in mind',
            'Created documentation for such components',
            'Synthesized a vision for a themeable design system to meet Blend’s product needs',
            'Collaborated with the brand team to put together concepts for a reference site',
            'Collaborated with Engineering to establish foundations for theming architecture',
            'Established design tokens: typography, colors, icons, and basic grid structure',
          ]}
        ></List>,
      ],
    },
    {
      section: 'Problem',
      content: [
        <ImageWithCaption
          white
          src={Alchemy_foundations}
          caption="A brief overview of Alchemy's foundations"
        />,
        <div>
          The problem at hand was that Blend was facing two issues: there were
          separate component libraries for each product and that some products
          do share many components from different libraries. On top of that,
          Blend’s consumer products are primarily white labeled, meaning the
          design system carries no branding since the branding is derived from
          the customer’s branding. For example, Wells Fargo’s Mortgage
          application via Blend takes on the Wells Fargo brand colors.
        </div>,
        <div>
          However, with the growth of the Consumer banking platform as well as
          customer asks, Blend has been exploring ways to let customers
          customize their visual identity more within the Blend application.
          Thus, Alchemy’s first goal is to unify all the fragmented design
          libraries and also establish a shared language amongst design and
          engineering. The second goal is to support theming in a way that
          Alchemy can support drastically different visual styles. The implicit
          goal is also to then be able to support theming so that our customers
          can then create their own theme so that their application experience
          can be tailored to a customer’s brand.
        </div>,
      ],
    },
    {
      section: 'Process',
      content: [
        <ImageWithCaption
          white
          src={Alchemy_theme_object}
          caption="An example of Alchemy's theme object with three tiers: primitives, semantics, and component level overrides."
        />,
        <ImageWithCaption
          white
          src={Alchemy_theming}
          caption="Alchemy supports multiple design languages with the use of theming."
        />,
        <ImageWithCaption
          src={Alchemy_checkbox}
          caption="Alchemy's checkbox component with the enterprise theme."
        />,
        <ImageWithCaption
          src={Alchemy_reference_site_color}
          caption="Alchemy's Color page mock for the reference site"
        />,
        <ImageWithCaption
          src={Alchemy_reference_site_component}
          caption="Alchemy's component documentation mock for the reference site"
        />,
      ],
    },
  ];

  return (
    <Projects
      title="Alchemy"
      date="April 2020 - Present"
      summary={summaryText}
      content={AlchemyContent}
    />
  );
};

export default Alchemy;
