import React from "react";
import Projects from "../../components/templates/prose/prose.component";
import { Text } from "../../components/text/text.component";
import { List } from "../../components/list/list.component";
import { ImageWithCaption } from "../../components/ImageWithCaption/ImageWithCaption.component";
import haven_cover from "../../assets/images/projects/Haven/haven_cover.png";
import haven from "../../assets/images/projects/Haven/haven.png";
import { Link } from "react-router-dom";

export const Haven = () => {
  const AbstractMigrate = (
    <Link className="action-link" to="/AbstractMigrate" target="_blank">
      <Text
        size="Body-bold"
        text="👉 Click here to read more about the abstract migration tool"
      />
    </Link>
  );
  const summaryText = `Haven was Blend's first published Figma plugin, built to help product
      designers document and protect their explorations and archived screens and
      to tag screens for cleaner handoff. It ships 2 overlay types —
      EXPLORATION and ARCHIVE, both auto-resizing to the selected frames — and 3
      tag labels: Needs Review, Prod Ready, and a custom option. The problem it
      solves is concrete: with short design turnarounds, years-old explorations
      were being mistaken for current specs, causing throwaway work from a
      simple mix-up. Haven started as a side project and an excuse to learn the
      Figma plugin API, and became a way to extend Design Technology's support
      into Product Design beyond design systems.`;

  const HavenContent = [
    {
      section: "Responsibilities",
      content: [
        <List
          size="Body"
          listItems={[
            "Designed, developed, and published Blend’s first Figma plugin, end to end and solo",
            "Shipped 2 auto-resizing overlay types (EXPLORATION, ARCHIVE) and 3 frame tags (Needs Review, Prod Ready, custom)",
            "Proposed the project myself, scoped from observed Product Designer pain points",
            "Researched and experimented with Figma’s plugin API from scratch",
            "Carefully researched and planned the plugin rollout",
            "Educated both brand and product designers on the plugin’s capabilities",
            "Gathered feedback to iterate and ideate new features",
          ]}
        ></List>,
      ],
    },
    {
      section: "Problem",
      content: [
        <Text
          size="Body"
          marginBottom={16}
          text={` One of the issues that product designers face at Blend (I'm sure this
        is probably an issue at other startups as well) is having to design
        features within a short turnaround and in fringe cases, old
        explorations (we’re talking multiple years) would be mistaken as
        design specs. Additionally, exploration files of current working files
        would be mistaken as a spec, thus causing throw away work due to a
        simple mix up.`}
        />,
      ],
    },
    {
      section: "Solution & Deliverables",
      content: [
        <ImageWithCaption
          src={haven_cover}
          caption="Overview of HAven overlays and tags"
        />,
        <Text
          size="Body"
          marginBottom={16}
          text={` Haven’s conception mainly came out of two primary reasons: one was to
        help product designers ‘protect’ their work by making explicit call
        outs to exploratory work and another reason was to expand Design
        Technology’s support within Product Design at Blend. I primarily took
        this as an opportunity to support the Product Design team beyond
        design systems. I’ve previously made an Abstract migration tool to
        help with the migration off of Sketch + Abstract and on to Figma. My
        next personal goal was to learn how to make a Figma Plugin, and upon
        learning of a few of the issues that Product Designer’s faced, I chose
        to make Haven for the team, and use it as a learning experience for my
        own growth as well.`}
        />,
        AbstractMigrate,
        <Text
          size="Body"
          marginBottom={16}
          text={`Haven makes it easy for designers to add one of two overlays:
      “EXPLORATION” or “ARCHIVE”. The overlays added will resize based on
      the selected frames, and the text size as well as the text itself can
      be modified. Additionally, designers can also add ‘tags’ above each
      frame to label frames as “Needs Review,” “Prod Ready,” or a custom
      label. Designers just have to select the frames they’d like to label,
      run the plugin, and configure what the label or overlay will say.`}
        />,
      ],
    },
  ];

  return (
    <Projects
      title="Haven"
      date="June 2020"
      summary={summaryText}
      image={haven}
      image_caption="Haven cover"
      content={HavenContent}
    />
  );
};

export default Haven;
