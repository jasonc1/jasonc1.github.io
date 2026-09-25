import Projects from "../../components/templates/prose/prose.component";
import { List } from "../../components/list/list.component";
import { Text } from "../../components/text/text.component";
import AbstractMigrateDefine from "../../assets/images/projects/AbstractMigrate/AbstractMigrateDefine.png";
import AbstractMigrateTimeline from "../../assets/images/projects/AbstractMigrate/AbstractMigrateTimeline.png";
import { ImageWithCaption } from "../../components/ImageWithCaption/ImageWithCaption.component";

export const AbstractMigrate = () => {
  const AbstractAPI = (
    <a
      className="action-link"
      target="_blank"
      rel="noreferrer"
      href={"https://sdk.goabstract.com/docs/abstract-api/"}
    >
      <Text size="Body-bold" text="Abstract's API" />
    </a>
  );
  const summaryText = (
    <div className="summary-text-link">
      <Text
        size="Body"
        text={`A quarter-long initiative where the design technology team fully sunset
      Abstract — after two prior failed attempts — by leveraging Abstract's
      API. Over my first year at Blend the Product Design team slowly moved
      onto Figma, and in Q1 2020 we set out to migrate every legacy Sketch
      file into Box. I wrote a Node.js script that migrated 750+ Sketch files
      across roughly 100 Abstract projects, saving hundreds of hours of
      product designer time that would otherwise have gone to downloading and
      moving files by hand. By then designers were spending only ~10% of their
      time in Sketch, mostly referencing old files rather than designing, so
      the migration also ended the Abstract subscription outright.`}
      />
      {AbstractAPI}
    </div>
  );
  const AbstractMigrateContent = [
    {
      section: "Responsibilities",
      content: [
        <List
          size="Body"
          listItems={[
            "750+ Sketch files across ~100 projects, migrated by script",
            "Hundreds of designer hours saved",
            "Node.js script against Abstract's API — the first version that could download",
            "Quarter-long rollout that ended the subscription, after 2 failed attempts",
            "File labelling and archive structure",
            "Monthly power hours with the Product Design team",
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
          text={`When I joined Blend around February 2019, Figma was gaining traction
        within the product design team, and it became the unofficial design
        tool that everyone started using. However, we spent about the next
        year floating between old files in Sketch and creating new files in
        Figma.`}
        />,

        <Text
          size="Body"
          marginBottom={16}
          text={`For those not familiar with Abstract, in theory it serves as something
          similar to a git repository but for sketch files. Thus, it houses all
          of Blend’s Sketch projects in the following manner: A project can have
          many branches (like master/main, explorations, etc). Each branch is
          essentially a Sketch file, and a project entails many branches (or
          sketch files) like the following:`}
        />,
        <pre>
          <code>blend-projects/</code>
          <br />
          <code>&nbsp;&nbsp;project-1/</code>
          <br />
          <code>&nbsp;&nbsp;&nbsp;&nbsp;branch-A/</code>
          <br />
          <code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;file-A.sketch</code>
          <br />
          <code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;file-B.sketch</code>
          <br />
          <code>&nbsp;&nbsp;&nbsp;&nbsp;branch-B/</code>
          <br />
          <code>&nbsp;&nbsp;project-2/</code>
          <br />
          <code>...</code>
        </pre>,
        <Text
          size="Body"
          marginBottom={16}
          text={`Throughout that year, we tried to sunset Abstract twice. We failed to
        do so the first time (roughly October 2019) because Abstract’s API
        only let us list files in our Abstract ‘repo,’ but we could not
        download at that time. On top of that, we had what turned out to be
        roughly 100 projects (750+ files sketch files) in Abstract. The team
        eventually abandoned the plan to sunset Abstract because of the sheer
        amount of manual labor it would entail: downloading each branch from
        each project and then moving the files to Box.`}
        />,
      ],
    },
    {
      section: "Solution & Deliverables",
      content: [
        <ImageWithCaption
          src={AbstractMigrateDefine}
          caption="Defining what success looks like for the roll out plan."
        />,
        <Text
          size="Body"
          marginBottom={16}
          text={`In March 2020, the PD team decided to revisit sunsetting Abstract as
        the team found that most designers are now designing in Figma and
        spending roughly 10% of their time in Sketch. For the most part, most
        of the tasks being done in Sketch were simply referencing old files
        less so designing`}
        />,
        <Text
          size="Body"
          marginBottom={16}
          text={`Thus, the design technology team set out to create a quarter long plan
          to roll out sunsetting Abstract. The first task at hand was to create
          a plan that would factor in the amount of time it require to have
          designers manually migrate their files each at a bi-weekly or monthly
          cadence. However, we decided to revisit the Abstract API to see if
          they made any feature updates. Much to our surprise, they added
          support to download files programmatically. we devised a plan that
          determined when product designers should stop using Abstract, batch
          download files, labelling, and thus fully sunsetting Abstract and
          ending the subscription. Below, you can see what the overall timeline
          was.`}
        />,

        <ImageWithCaption
          src={AbstractMigrateTimeline}
          caption="Timeline of rollout plan"
        />,
      ],
    },
  ];

  return (
    <Projects
      title="Abstract Migrate Tool"
      date="Mar 2020 - Jul 2020"
      summary={summaryText}
      content={AbstractMigrateContent}
    />
  );
};

export default AbstractMigrate;
