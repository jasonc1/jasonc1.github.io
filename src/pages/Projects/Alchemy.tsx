import Projects from "../../components/templates/prose/prose.component";
import { List } from "../../components/list/list.component";
import { ImageWithCaption } from "../../components/ImageWithCaption/ImageWithCaption.component";
import Alchemy_cover from "../../assets/images/projects/Alchemy/Alchemy_cover.png";
import Alchemy_foundations from "../../assets/images/projects/Alchemy/Alchemy_foundations.png";
import Alchemy_theming from "../../assets/images/projects/Alchemy/Alchemy_theming.png";
import Alchemy_checkbox from "../../assets/images/projects/Alchemy/Alchemy_checkbox.png";
import Alchemy_reference_site_color from "../../assets/images/projects/Alchemy/Alchemy_reference_site_color.png";
import Alchemy_reference_site_component from "../../assets/images/projects/Alchemy/Alchemy_reference_site_component.png";
import Alchemy_theme_object from "../../assets/images/projects/Alchemy/Alchemy_theme_object.png";
import { Text } from "../../components/text/text.component";

export const Alchemy = () => {
  const summaryText = `Alchemy is Blend’s unified design system, and I was a founding member of
      the effort — the foundation it established supported Blend’s growth from
      400 to 1,000+ employees. Alchemy consolidated Blend’s fragmented
      per-product component libraries into one system that both enterprise and
      consumer products design and build with. It is the product of numerous
      prior attempts to establish a design system at Blend, folding in every
      one of those learnings. What makes it unique is the “system for systems”
      approach: a three-tier theme object — primitives, semantics, and
      component-level overrides — lets one codebase render visually distinct
      component sets that effectively act as one-to-many design systems.`;

  const AlchemyContent = [
    {
      section: "Responsibilities",
      content: [
        <List
          size="Body"
          listItems={[
            "Founding member of the Alchemy design system, establishing the unified foundation that supported Blend’s growth from 400 to 1,000+ employees",
            "Consolidated fragmented per-product component libraries into one themeable system serving both the enterprise and consumer product families",
            "Established the 3-tier theming architecture with Engineering: primitives, semantics, and component-level overrides",
            "Established design tokens: typography, colors, icons, and basic grid structure",
            "Designed components with theming and accessibility in mind, and wrote their documentation",
            "Synthesized the vision for a themeable design system after several prior failed attempts at Blend, folding in each one’s learnings",
            "Collaborated with the brand team to put together concepts for a reference site",
          ]}
        ></List>,
      ],
    },
    {
      section: "Problem",
      content: [
        <ImageWithCaption
          white
          src={Alchemy_foundations}
          caption="A brief overview of Alchemy's foundations"
        />,
        <Text
          size="Body"
          marginBottom={16}
          text={`The problem at hand was that Blend was facing two issues: there were
        separate component libraries for each product and that some products
        do share many components from different libraries. On top of that,
        Blend’s consumer products are primarily white labeled, meaning the
        design system carries no branding since the branding is derived from
        the customer’s branding. For example, Wells Fargo’s Mortgage
        application via Blend takes on the Wells Fargo brand colors.`}
        />,
        <Text
          size="Body"
          marginBottom={16}
          text={`However, with the growth of the Consumer banking platform as well as
      customer asks, Blend has been exploring ways to let customers
      customize their visual identity more within the Blend application.
      Thus, Alchemy’s first goal is to unify all the fragmented design
      libraries and also establish a shared language amongst design and
      engineering. The second goal is to support theming in a way that
      Alchemy can support drastically different visual styles. The implicit
      goal is also to then be able to support theming so that our customers
      can then create their own theme so that their application experience
      can be tailored to a customer’s brand.`}
        />,
      ],
    },
    {
      section: "Process",
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
      date="April 2020 - October 2021"
      summary={summaryText}
      content={AlchemyContent}
      image={Alchemy_cover}
      image_caption="Alchemy brand logo"
    />
  );
};

export default Alchemy;
