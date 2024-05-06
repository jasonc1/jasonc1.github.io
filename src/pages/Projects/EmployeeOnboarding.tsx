import React from "react";
import Projects from "../../components/templates/prose/prose.component";
import { Text } from "../../components/text/text.component";
import { List } from "../../components/list/list.component";
import { ImageWithCaption } from "../../components/ImageWithCaption/ImageWithCaption.component";
import Welcome from "../../assets/images/projects/EmployeeOnboarding/Welcome.png";
import TwoFactor from "../../assets/images/projects/EmployeeOnboarding/TwoFactor.png";
import PersonalInfo from "../../assets/images/projects/EmployeeOnboarding/PersonalInfo.png";

const EmployeeOnboardingProto = (
  <a
    className="action-link"
    target="_blank"
    rel="noreferrer"
    href={"https://employee-onboarding-poc-1.netlify.app/"}
  >
    <Text
      size="Body-bold"
      text="👉 Click here to view option 1 of the prototypes (pw:
          'abby')."
    />
  </a>
);

export const EmployeeOnboarding = () => {
  const summaryText = `Prototyping played a crucial role in the design of the new onboarding
      flow. Three prototypes were created so that we could validate the new flow
      with the integration of 2FA upon account creation. The new onboarding flow
      would also collect more data up front so that users wouldn't have to input
      additional info when it came to do actions like exercising their stock
      options. Thus an interactive prototype was created to test the feasibility
      of the new experience, to iterate on different variations, and to user
      test.`;

  const ExerciseStatusContent = [
    {
      section: "Responsibilities",
      content: [
        <List
          ordered
          size="Body"
          listItems={[
            "Built a total of 3 end to end hi-fidelity prototypes",
            "Leveraged existing ink componets while providing suggestions for the UI",
            "Pixel perfect attention to detail to call out one-offs or to clean up design spec",
            "Validated designs through user testing as well as coding functionality",
            "Design QA-ed for release",
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
          text={` As an employee accepts their option grant, at a certain point they
          will most likely exercise to realize their equity. However they were
          faced with some obstacles when initiating their exercise request: they
          needed to provide more info as well as set up 2FA. Thus, a prototype
          was needed to help test amongst users variations of the flow to reach
          the most optimal experience.`}
        />,
      ],
    },
    {
      section: "Solution & Deliverables",
      content: [
        <Text
          size="Body"
          marginBottom={16}
          text={`Like most prototypes, one main goal of prototyping the onboarding flow
          was to test feasibility of the front end and to reduce the creation of
          new components. Additionally, the prototype served as an avenue to
          confidently decision make around where to surface equity education as
          well as gauge the impact of 2FA being part of the onboarding flow.`}
        />,
        <div className="summary-text-link">
          <Text size="Body" text="Three prototypes were created:" />
          <List
            ordered
            size="Body"
            listItems={[
              "option 1: 2FA → form (including equity education) → success,",
              "option 2: NO 2FA → form (including equity education) → success,",
              "option 3: 2FA → form → success → equity education,",
            ]}
          ></List>
          {EmployeeOnboardingProto}
        </div>,
      ],
    },
    {
      section: "Process",
      content: [
        <ImageWithCaption
          src={TwoFactor}
          white
          caption="Login screens were also mocked out for testing to simulate a real signup flow with 2FA setup before the user fills out their information"
        />,
        <ImageWithCaption
          src={PersonalInfo}
          white
          caption="The onboarding flow itself happens after account creation + 2FA, and it consists of 3 steps: personal info, address, and grant acceptance"
        />,
      ],
    },
  ];
  return (
    <Projects
      title="Carta Employee Onboarding"
      date="March 2022"
      summary={summaryText}
      image={Welcome}
      image_caption="Employee onboarding V2, now with a 10% improvement in signups"
      content={ExerciseStatusContent}
    />
  );
};

export default EmployeeOnboarding;
