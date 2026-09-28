import Projects from "../../components/templates/prose/prose.component";
import { List } from "../../components/list/list.component";
import { ImageWithCaption } from "../../components/ImageWithCaption/ImageWithCaption.component";
import sapling_example from "../../assets/images/projects/Sapling/sapling_example.png";
import sapling from "../../assets/images/projects/Sapling/sapling.png";
import { Text } from "../../components/text/text.component";

export const Sapling = () => {
  const summaryText = `Sapling is a Figma plugin that instantiates a standard 7-page structure and
      cover page into any new Figma file with one run. It came out of an
      initiative to end two years of free-form file organization across the
      Product Design team — after the move off Sketch + Abstract, every
      designer's files were laid out differently, and files moved between Figma
      teams constantly as priorities and team structure changed. Standardizing
      the page structure meant any designer or cross-functional partner could
      open any file and know where production screens, specs, WIP, and archives
      live.`;

  const SaplingContent = [
    {
      section: "Responsibilities",
      content: [
        <List
          size="Body"
          listItems={[
            "Figma plugin instantiating a 7-page file structure in one run",
            "Audited the Product Design team's files to find the drift",
            "Ended 2 years of free-form file organisation",
            "Mapped Figma teams, projects and files to EPD cohorts and initiatives",
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
          text={` As we moved away from Sketch + Abstract and thus on to Figma, the last
          two years have been a bit free form when it came to file organization
          within Figma. Overall, we found that there was a lack of consistency
          within our files. Furthermore, files moved within Figma teams
          frequently due to changing priorities, team structure, and so on.`}
        />,
      ],
    },
    {
      section: "Solution & Deliverables",
      content: [
        <ImageWithCaption
          white
          src={sapling_example}
          caption="Sapling used in a Figma file"
        />,
        <Text
          size="Body"
          marginBottom={16}
          text={`Consistency in our file structure will help other designers and our
        cross-functional partners better navigate to find the right designs.
        Keeping the same page sections across files will provide quick context
        to where someone might find the type of designs they need.`}
        />,
        <Text
          size="Body"
          marginBottom={16}
          text={`We proposed a file structure so that each Figma File so that every net
      new Figma File created would have the following:`}
        />,
        <div></div>,
        <List
          size="Body"
          listItems={[
            "🖼 Cover page: project name, owner, and status",
            "🚀 Production/shipped: screens that currently reflect prod",
            "✅ Specs: handoff items/specs for eng",
            "🔍  In Review [optional]: screens that need design or eng review",
            "✍️ WIP: your working doc/explorations",
            "🗄 Archive: outdated designs",
            "⚡️ Demos [optional]: figma prototypes and demo screens",
          ]}
        ></List>,
        <Text
          size="Body"
          marginBottom={16}
          text={`Furthermore, we defined how Figma Teams, projects, and files relate to
          our team structure and projects. Figma teams will be organized by
          cohort to align with our EPD counterparts, though we recognize that
          this may require a level of maintenance should cohorts evolve (as
          we’ve seen this past year.`}
        />,
        <Text
          size="Body"
          marginBottom={16}
          text={`The most concrete artifacts we have are our features and our files are
          going to be based on them. While multiple teams or multiple designers
          may work on a file across multiple projects, the multiple variations
          of a feature will be together. Our Figma files should like up with
          features we are building.`}
        />,
        <Text
          size="Body"
          marginBottom={16}
          text={` Hopefully our initiatives don't change as much as the teams working on
        them. While they come and go in priority, the files they group
        generally stay together. We'll be matching Figma projects to our
        Initiatives.`}
        />,
      ],
    },
  ];

  return (
    <Projects
      title="🌱 Sapling"
      date="Aug 2020 - Sept 2020"
      summary={summaryText}
      image={sapling}
      image_caption="Sapling overview image"
      content={SaplingContent}
    />
  );
};

export default Sapling;
