import React from "react";
import Projects from "../../components/templates/prose/prose.component";
import { Text } from "../../components/text/text.component";
import { List } from "../../components/list/list.component";
import { ImageWithCaption } from "../../components/ImageWithCaption/ImageWithCaption.component";
import OTMBanner from "../../assets/images/projects/OTM/OTMBanner.png";
import OTMEmblem from "../../assets/images/projects/OTM/OTMEmblem.png";
import OTMFramerX from "../../assets/images/projects/OTM/OTMFramerX.png";
import OTMProtopie from "../../assets/images/projects/OTM/OTMProtopie.png";
import OTMRBC from "../../assets/images/projects/OTM/OTMRBC.png";
import OTMLoading from "../../assets/images/projects/OTM/OTMLoading.png";

export const OTM = () => {
  const ForumDemo = (
    <a
      className="action-link"
      target="_blank"
      rel="noreferrer"
      href={"https://otm-forum-demo.netlify.app/"}
    >
      <Text
        size="Body-bold"
        text="👉 Check out the demo! Please view on mobile."
      />
    </a>
  );

  const summaryText = (
    <div className="summary-text-link">
      <Text
        size="Body"
        text={` One-Tap Mobile (OTM) was Blend's 2019 company vision made testable: get
        a homebuyer a mortgage preapproval letter in one tap. As the dedicated
        prototyper on the Design team for 6 months, I built the highest-fidelity
        mobile proof of concept possible out of production-level React
        components, so the prototype doubled as an engineering handoff artifact
        for an experience far too interaction- and content-heavy to spec in
        static mocks. I shipped multiple iterations across 3 prototyping stacks
        — ReactJS primarily, plus FramerX and ProtoPie — covering the full
        6-stage flow from financial-institution login through consent, a long
        data-processing loading state, buying-power education, and the
        preapproval letter itself. Because Blend's consumer products are
        white-labeled, I architected a theming layer that re-skinned the entire
        demo per client, which is how the same prototype served tailor-made
        sales demos (RBC among them) and user-study sessions.`}
      />
      {ForumDemo}
    </div>
  );

  const OTMContent = [
    {
      section: "Responsibilities",
      content: [
        <List
          ordered
          size="Body"
          listItems={[
            "Dedicated prototyper on the Design team for 6 months",
            "All 6 stages of the OTM flow, in production-level React",
            "Theming layer re-skinned the entire demo per client (RBC among them)",
            "3 prototyping stacks evaluated: React, FramerX, ProtoPie",
            "Loading-state design for a long-running underwriting process",
            "Demos for sales and for user tests",
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
          text={`Blend's vision for 2019 was to drastically change how mortgages could
        be completed: the goal was to try and net a user a preapproval letter
        with ‘one-tap.’ The idea was that, given the right circumstances with
        bank accounts and data all connected, a user could log in on their
        phone when house hunting, and get a preapproval letter instantly.
        Through Blend’s app and if the user had most of their financial
        information and assets in one of Blend’s clients (read as clients like
        Wells Fargo), OTM could process all the information and handle all the
        underwriting to provide a preapproval letter.`}
        />,
      ],
    },
    {
      section: "Solution & Deliverables",
      content: [
        <Text
          size="Body"
          marginBottom={16}
          text={` This was a brand new experience that Blend was setting out to test
        out, so I was brought on the Design team as the dedicated prototyper
        to work with design through the flows and the overall experience to
        produce a working demo for user testing as well as a handoff
        item for engineering to reference. OTM is a very intricate experience
        since there is a huge amount of behind the scenes processes that need
        to happen sequentially for the experience to work. The design team had
        to figure out the whole flow (at a high level) from:`}
        />,

        <List
          ordered
          size="Body"
          listItems={[
            "Logging into their financial institution",
            "Providing consent for OTM",
            "Surfacing a potentially long loading state while OTM fetches and processes data",
            "Showcasing and educating a user's buying power",
            "Produce a preapproval letter",
            "Provide methods for a user to edit or add information to increase their buying power or modify the preapproval letter",
          ]}
        ></List>,
      ],
    },
    {
      section: "Process",
      content: [
        <ImageWithCaption
          src={OTMFramerX}
          iphone
          caption="OTM in its early days, built with FramerX"
        />,
        <ImageWithCaption
          src={OTMEmblem}
          iphone
          caption="OTM is a whitelabel solution"
        />,
        <ImageWithCaption
          src={OTMRBC}
          iphone
          caption="OTM branded for a demo for RBC"
        />,
        <ImageWithCaption src={OTMLoading} caption="Loading states for OTM" />,

        <ImageWithCaption
          src={OTMProtopie}
          white
          caption="Authentication and Prefill prototypes for user testing"
        />,
      ],
    },
  ];
  return (
    <Projects
      title="One-Tap Mobile"
      date="Mar 2019 - Sept 2019"
      summary={summaryText}
      image={OTMBanner}
      image_caption="One-tap Mobile aka OTM"
      content={OTMContent}
    />
  );
};

export default OTM;
