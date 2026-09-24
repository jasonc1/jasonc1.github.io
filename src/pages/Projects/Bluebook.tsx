import React from "react";
import Projects from "../../components/templates/prose/prose.component";
import { List } from "../../components/list/list.component";
import { ImageWithCaption } from "../../components/ImageWithCaption/ImageWithCaption.component";
import Cover from "../../assets/images/projects/Bluebook/Cover.png";
import ProcessImprovements from "../../assets/images/projects/Bluebook/ProcessImprovements.png";
import Spacing from "../../assets/images/projects/Bluebook/Spacing.png";
import SpacingGuidelines from "../../assets/images/projects/Bluebook/SpacingGuidelines.png";
import SpacingVocab from "../../assets/images/projects/Bluebook/SpacingVocab.png";
import SpacingVocabDiagram from "../../assets/images/projects/Bluebook/SpacingVocabDiagram.png";
import TableFiltering from "../../assets/images/projects/Bluebook/TableFiltering.png";
import TableFilterSelect from "../../assets/images/projects/Bluebook/TableFilterSelect.png";
import TableInitialLoad from "../../assets/images/projects/Bluebook/TableInitialLoad.png";
import TableRowSelect from "../../assets/images/projects/Bluebook/TableRowSelect.png";
import TablesBeforeAndAfter from "../../assets/images/projects/Bluebook/TablesBeforeAndAfter.png";
import TableLoadingProto from "../../assets/images/projects/Bluebook/TableLoadingProto.png";
import ChipsAnatomy from "../../assets/images/projects/Bluebook/ChipsAnatomy.png";
import ChipsKeyboardNav from "../../assets/images/projects/Bluebook/ChipsKeyboardNav.png";
import ChipsUsage from "../../assets/images/projects/Bluebook/ChipsUsage.png";
import ChipsUserTestProto from "../../assets/images/projects/Bluebook/ChipsUserTestProto.png";

export const Bluebook = () => {
  const summaryText = `I led the Bluebook design system at Everlaw for 20 months as DS Lead. The headline result: component delivery dropped from 4-6 quarters to 1-2 quarters each, by replacing one monolithic handoff with a phased, iterative contribution process. Alongside that I drove the migration to Storybook 7 as the system's documentation home (retiring ZeroHeight), converged the platform off a 10pt grid onto an 8pt half-grid with a shared spacing vocabulary, and shipped foundational components: table filtering, pagination, skeleton loading states, listboxes, chips/counter tags, and tokens. I was brought on to speed up React adoption, modernize the platform across multiple products, and consolidate legacy patterns; I also championed accessibility and pushed product design and engineering to scope, implement, and iterate together. The work earned a Product org-wide spot award in Q1 2024.`;

  const BluebookContent = [
    {
      section: "Responsibilities",
      content: [
        <List
          size="Body"
          listItems={[
            "Cut component delivery from 4-6 quarters to 1-2 quarters by rebuilding the contribution process into a phased, iterative model",
            "Owned the entire design system end to end across a 20-month tenure: process, documentation, design QA, and implementation",
            "Championed the Storybook (SB7) migration, consolidating documentation off ZeroHeight onto one live reference site written in .mdx",
            "Converged the platform from a 10pt grid onto an 8pt half-grid, and defined a shared spacing vocabulary + guidelines so design and engineering describe layouts the same way",
            "Shipped foundational components — table filtering, pagination, skeleton loading, chips/counter tags, listboxes, tokens — while retiring one-off patterns and design debt",
            "Ran user testing on the chips/labels flow: a core but confusing UX with intermediary states (added-but-not-saved), and shipped the revised pattern",
            "Reimagined the collaboration, spec, and design QA process between the FE squad and design system squad members",
            "Mentored junior design system squad members, ran quarterly roadmap planning, and held weekly office hours",
            "Improved the platform holistically via component adoption while balancing immediate product feature support across multiple Everlaw products",
          ]}
        ></List>,
      ],
    },
    {
      section: "Design system contributions",
      content: [
        <ImageWithCaption
          src={TablesBeforeAndAfter}
          caption="Tables before Table filtering, pagination, and loading states were implemented."
        />,
        <ImageWithCaption
          src={TableFiltering}
          caption="Table filtering via popover supports single/multiple keywords, global search, date and number ranges, checkbox filtering, and filter summaries"
        />,
        <ImageWithCaption
          src={TableFilterSelect}
          caption="Selecting a filter in the active filters popover opens the exact filter applied"
        />,
        <ImageWithCaption
          src={TableLoadingProto}
          caption="Skeleton loader prototype made in codepen with CSS to support initial load, pagination, and reflect any state change via filtering etc"
        />,
        <ImageWithCaption
          src={TableInitialLoad}
          caption="Initial loading state leverages skeleton loaders"
        />,
        <ImageWithCaption
          src={TableRowSelect}
          caption="Table UI updates based on filtering, selection, and more"
        />,
        <ImageWithCaption
          src={Spacing}
          caption="Spacing values defined to consolidate and converge 10pt grid to 8pt half grid"
        />,
        <ImageWithCaption
          src={SpacingVocab}
          caption="Shared language and vocabulary defined for easier collaboration when talking about layouts and elements and writing guidelines"
        />,
        <ImageWithCaption
          src={SpacingVocabDiagram}
          caption="Visuals supporting spacing vocabulary"
        />,
        <ImageWithCaption
          src={SpacingGuidelines}
          caption="Example guidelines highlighting patterns and bad practices written for 24px spacing unit"
        />,
        <ImageWithCaption
          src={ChipsAnatomy}
          caption="Chips (or interactive tags) anatomy defined with 3 key variants"
        />,
        <ImageWithCaption
          src={ChipsKeyboardNav}
          caption="Keyboard navigation and focus states pattern for highlighting interativity on both onClick and removal of chip"
        />,
        <ImageWithCaption
          src={ChipsUsage}
          caption="Usage guildelines defined for chips explaining the differences between variants and other components"
        />,
        <ImageWithCaption
          src={ChipsUserTestProto}
          caption="User testing sessions were conducted in hopes to improve a very confusing yet critical core UX of the product: adding and removing labels but with intermediary states (added but not saved, etc)"
        />,
        <ImageWithCaption
          src={ProcessImprovements}
          caption="Revamped component contribution process to a phased and iterative approach; reduced development time from 4-6 quarters to 1-2 quarters."
        />,
      ],
    },
  ];

  return (
    <Projects
      title="Bluebook"
      date="January 2023 - August 2024"
      summary={summaryText}
      image={Cover}
      image_caption="Bluebooks reference site, run on Storybook written in .mdx"
      content={BluebookContent}
    />
  );
};

export default Bluebook;
