import React from "react";
import Projects from "../../components/templates/prose/prose.component";
import { Text } from "../../components/text/text.component";
import { List } from "../../components/list/list.component";
import { ImageWithCaption } from "../../components/ImageWithCaption/ImageWithCaption.component";
import WaitTask from "../../assets/images/projects/WaitTask/WaitTask.png";
import WaitTaskScreens from "../../assets/images/projects/WaitTask/WaitTaskScreens.png";

export const WaitTaskV2 = () => {
  const prototype = (
    <a
      className="action-link"
      target="_blank"
      rel="noreferrer"
      href={"https://wait-task-v2.netlify.app/"}
    >
      <Text size="Body-bold" text="👉 Check out the prototype!" />
    </a>
  );
  const summaryText = (
    <div className="summary-text-link">
      <Text
        size="Body"
        text={`Wait Task V2 is a project where prototyping was leveraged to flesh out a
        loading experience through code. A hi-fi prototype was made in a matter of
        days to help the Design team figure out transitions, content, and
        technical constraints. The prototype was coded in ReactJS and served as a
        not only a working sandbox for designers to see the experience in real
        time but also a handoff item for engineering and thus saving several weeks
        of development time.`}
      />
      {prototype}
    </div>
  );

  const WaitTaskContent = [
    {
      section: "Responsibilities",
      content: [
        <List
          size="Body"
          listItems={[
            "Created a hi-fi prototype with ReactJS",
            "Collaborated with Design to work through step by step transitions",
            "Collaborated with Engineering for hand off and walked through code",
            "Aided Engineering in making code production ready",
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
          text={`The original Wait Task experience was simply a spinner with some text
          that lasted somewhere around 30 seconds, and the home insurance team
          wanted to make the experience more dynamic and informative for the
          user.`}
        />,

        <ImageWithCaption
          src={WaitTaskScreens}
          caption="The three stages of the Wait Task experience"
        />,
        <Text
          size="Body"
          marginBottom={16}
          text={` I was presented a few screens in Figma, and there were three ‘stages’
        of the wait task. However, many of the transitions were not figured
        out and there seemed to be a lot of moving pieces between each
        ‘stage.’ Thus, we figured it would be small enough scope but yet
        worthwhile to invest time to coding a hi-fi prototype in order to work
        through all the transitions and intricate interactions.`}
        />,
      ],
    },
    {
      section: "Solution & Deliverables",
      content: [
        <Text
          size="Body"
          marginBottom={16}
          text={`As mentioned, the prototype that I was able to produce with the Design
          team served as a deliverable for hand off for the engineering team.
          The prototype came to be a useful addition to the design mocks since
          the engineers could see exactly what was happening frame by frame, but
          most importantly, the engineers could also reference my code.`}
        />,
      ],
    },
  ];

  return (
    <Projects
      title="Home Insurance Wait Task V2"
      date="October 2019"
      summary={summaryText}
      image={WaitTask}
      image_caption="Wait Task V2 is a dynamic yet informative loading experience for home insurance customers"
      content={WaitTaskContent}
    />
  );
};

export default WaitTaskV2;
