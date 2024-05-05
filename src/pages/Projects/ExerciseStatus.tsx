import React from "react";
import Projects from "../../components/templates/prose/prose.component";
import { Text } from "../../components/text/text.component";
import { List } from "../../components/list/list.component";
import { ImageWithCaption } from "../../components/ImageWithCaption/ImageWithCaption.component";
import ExerciseStatus1 from "../../assets/images/projects/ExerciseStatus/ExerciseStatus1.png";
import ExerciseStatus2 from "../../assets/images/projects/ExerciseStatus/ExerciseStatus2.png";

const ExerciseStatusProto = (
  <a
    className="action-link"
    target="_blank"
    rel="noreferrer"
    href={"https://exercise-status-poc.netlify.app/"}
  >
    <Text size="Body-bold" text="prototype" />
  </a>
);

export const ExerciseStatus = () => {
  const summaryText = (
    <div>
      <ImageWithCaption
        src={ExerciseStatus1}
        white
        caption="A redesigned 'tracker-esque' paradigm for displaying exericse status"
      />
      A common frustration that user's have with Carta is how slow the process
      is to exercise an option grant. Exercising options can take roughly a week
      and is a multistep process: user submits exercise request, Admin
      approves/rejects, payment, certificate issued, and lastly user signs
      certificate. The task was to revamp the exercise status for more
      transparency behind the status as opposed to simply saying "pending" or
      "cancelled."
    </div>
  );

  const ExerciseStatusContent = [
    {
      section: "Responsibilities",
      content: [
        <List
          ordered
          size="Body"
          listItems={[
            "Built a dynamic and end to end hi-fidelity prototype",
            "Explored ways to customize the Tracker component provided by the design system",
            "Collaborated with product designer to bring vision to life",
            "Provided feedback around error states and edge cases",
            "Provided ui feedback around tracker content and typography",
          ]}
        ></List>,
      ],
    },
    {
      section: "Problem",
      content: [
        <div>
          The main problem was that the current exercise flow would just show a
          status as "Pending, Cancelled, or Completed" for an ongoing exercise
          request. Additionally, if the exercise was cancelled, there would be
          no information presented in the UI, and thus the user would have to
          email their admin for further details. Thus, there was a desire to
          improve this experience with the concept of a tracker while still
          considering the constraints of the app.
        </div>,
      ],
    },
    {
      section: "Solution & Deliverables",
      content: [
        <ImageWithCaption
          src={ExerciseStatus2}
          white
          caption="A view of exercise history of a given grant"
        />,
        <div>
          A {ExerciseStatusProto} (pw: 'abby') was thus created so that to test
          compatibility and feasibility with the ink design system. We needed to
          ensure that we as a design team could confidently build the existing
          experience with the Tracker component made by the ink team. This
          prototype served as a framework to test out microinteractions as well
          as a way to ensure edge cases for every status and information was
          properly mapped out to spec.
        </div>,
        <div>
          Moreover, the prototype served as an avenue where design could lead
          with research and test some findings with the prototype itself. As the
          prototype finished, the project was slated to be scoped into the Q4
          roadmap.
        </div>,
      ],
    },
  ];
  return (
    <Projects
      title="Carta Exercise Status Prototype"
      date="June 2022"
      summary={summaryText}
      content={ExerciseStatusContent}
    />
  );
};

export default ExerciseStatus;
