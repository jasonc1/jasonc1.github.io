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
  const summaryText = `During my time at Everlaw, I led and oversaw the Bluebook design system. Notable accomplishments include reducing development time from 4-6 quarters down to 1-2 quarters per component, a storybook migration, and many design system components ranging from interactive tags to table filtering, pagination and loading states. I was brought on to Everlaw to primarily help the company speed up React adoption, modernizing the entire platform across multiple products, and consolidating legacy patterns. Additionally, I helped champion and drive accessibility and advocated for more product design and engineering to scope, implement, and iterate more collaboratively.`;

  const BluebookContent = [
    {
      section: "Responsibilities",
      content: [
        <List
          size="Body"
          listItems={[
            "Managed entire design system ranging from process, documentation, design QA, and implementation",
            "Reimagined collaboration, spec, and design qa process between FE squad and design system squad members",
            "Championed storybook adoption and migration for documentation over ZeroHeight",
            "Mentored junior design system squad members",
            "Contributed foundational atomic elements, key components, and consolidated design debt and one-off patterns",
            "Wholistically improved the platform via component adoption while balancing immediate product feature support",
            "Roadmapped quarterly planning and ran weekly office hours",
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
