import React from 'react';
import Projects from '../../components/templates/prose/prose.component';
import { Text } from '../../components/text/text.component';
import { List } from '../../components/list/list.component';
import { ImageWithCaption } from '../../components/ImageWithCaption/ImageWithCaption.component';
import haven_cover from '../../assets/images/projects/Haven/haven_cover.png';
import haven from '../../assets/images/projects/Haven/haven.png';
import { Link } from 'react-router-dom';

export const Haven = () => {
  const AbstractMigrate = (
    <Link className="action-link" to="/AbstractMigrate" target="_blank">
      <Text size="link-1" text="abstract-migrate" />
    </Link>
  );
  const summaryText = (
    <div>
      <ImageWithCaption src={haven} caption="Haven cover" />
      Haven is a figma plugin I built to help product designers document and
      protect their explorations and archived screens as well as tagging screens
      for better handoff. Haven was a small side project and an opportunity to
      explore tooling for the Product design team within Figma.
    </div>
  );

  const HavenContent = [
    {
      section: 'Responsibilities',
      content: [
        <List
          size="body-1"
          listItems={[
            'Proposed side project to work on based on needs of Product Designers',
            'Researched and experimented with Figma’s API',
            'Developed, designed, and published Blend’s first Figma Plugin',
            'Carefully researched and planned out rollout of plugin',
            'Educated brand and product designers on the plugin’s capabilities',
            'Gathered feedback to iterate and ideate new features',
          ]}
        ></List>,
      ],
    },
    {
      section: 'Problem',
      content: [
        <div>
          One of the issues that product designers face at Blend (I'm sure this
          is probably an issue at other startups as well) is having to design
          features within a short turnaround and in fringe cases, old
          explorations (we’re talking multiple years) would be mistaken as
          design specs. Additionally, exploration files of current working files
          would be mistaken as a spec, thus causing throw away work due to a
          simple mix up.
        </div>,
      ],
    },
    {
      section: 'Solution & Deliverables',
      content: [
        <ImageWithCaption
          src={haven_cover}
          caption="Overview of HAven overlays and tags"
        />,
        <div>
          Haven’s conception mainly came out of two primary reasons: one was to
          help product designers ‘protect’ their work by making explicit call
          outs to exploratory work and another reason was to expand Design
          Technology’s support within Product Design at Blend. I primarily took
          this as an opportunity to support the Product Design team beyond
          design systems. I’ve previously made the {AbstractMigrate} tool to
          help with the migration off of Sketch + Abstract and on to Figma. My
          next personal goal was to learn how to make a Figma Plugin, and upon
          learning of a few of the issues that Product Designer’s faced, I chose
          to make Haven for the team, and use it as a learning experience for my
          own growth as well.
        </div>,
        <div>
          Haven makes it easy for designers to add one of two overlays:
          “EXPLORATION” or “ARCHIVE”. The overlays added will resize based on
          the selected frames, and the text size as well as the text itself can
          be modified. Additionally, designers can also add ‘tags’ above each
          frame to label frames as “Needs Review,” “Prod Ready,” or a custom
          label. Designers just have to select the frames they’d like to label,
          run the plugin, and configure what the label or overlay will say.
        </div>,
      ],
    },
    {
      section: 'Process',
      content: [
        <div>
          One of my goals for 2020 was to help the Product Design team more with
          tooling and applications of code. Thus, one application of code was to
          create a Figma Plugin since I spent a huge amount of time in Figma
          advocating for design systems, new features, cleaning up design debt,
          and more. However, I did not have a tangible use for a Figma Plugin,
          and I wanted it to be worthwhile. After a few chats with the team as
          well as a survey, I thus landed on a problem to try to solve for, and
          thus embarked on a journey to create Haven.
        </div>,
        <div>
          At first, Haven’s first feature was simply just adding an overlay with
          the word “EXPLORATION” in Figma. Since this was the first time I was
          making a plugin, I spent a few days exploring just how things worked.
          Figma has some great documentation as to how to get everything set up,
          but the project was just in plain html, css, and js.
        </div>,
        <div>
          Once I figured out how to programmatically ‘draw’ a frame with text
          and color, my goal was to then use webpack and react to speed up my
          development workflow. I actually found that using React made the
          plugin run slower so I removed that. However, webpack was used so that
          I didn’t have to manually refresh the application. I felt that such a
          simple app should be fast to render and did not warrant the use of
          React.
        </div>,
        <div>
          A few other features were added to add more customizability for the
          plugin. An additional overlay screen was made to call out ‘Archive’
          screens to differentiate explorations vs legacy screens. On top of
          that, I just played around with the idea to create two tags to aid
          with our review process: “NEEDS REVIEW” and “PROD READY.” These tags
          were to created to help with the handoff process and to further
          compliment the “EXPLORATIONS” and “ARCHIVE” overlays. These were made
          as tags since tags are less invasive and do not obscure the content of
          the frame.
        </div>,
      ],
    },
  ];

  return (
    <Projects
      title="Haven"
      date="June 2020"
      summary={summaryText}
      content={HavenContent}
    />
  );
};

export default Haven;
