import React from 'react';
import Projects from '../../components/templates/prose/prose.component';
import { Text } from '../../components/text/text.component';
import { List } from '../../components/list/list.component';
import { ImageWithCaption } from '../../components/ImageWithCaption/ImageWithCaption.component';
import OTMBanner from '../../assets/images/projects/OTM/OTMBanner.png';
import OTMEmblem from '../../assets/images/projects/OTM/OTMEmblem.png';
import OTMFramerX from '../../assets/images/projects/OTM/OTMFramerX.png';
import OTMProtopie from '../../assets/images/projects/OTM/OTMProtopie.png';
import OTMRBC from '../../assets/images/projects/OTM/OTMRBC.png';
import OTMLoading from '../../assets/images/projects/OTM/OTMLoading.png';

export const OTM = () => {
  const OTMMarketingLink = (
    <a
      className="action-link"
      target="_blank"
      rel="noreferrer"
      href={'https://blend.com/one-tap/'}
    >
      <Text size="link-1" text="one of Blend's flagship products" />
    </a>
  );
  const ForumDemo = (
    <a
      className="action-link"
      target="_blank"
      rel="noreferrer"
      href={'https://otm-forum-demo.netlify.app/'}
    >
      <Text size="link-1" text="prototype" />
    </a>
  );
  // const RBCDemo = (
  //   <a
  //     className="action-link"
  //     target="_blank"
  //     rel="noreferrer"
  //     href={'https://otm-rbc-demo.netlify.app/'}
  //   >
  //     <Text size="link-1" text="here" />
  //   </a>
  // );
  // const FramerXDemo = (
  //   <a
  //     className="action-link"
  //     target="_blank"
  //     rel="noreferrer"
  //     href={'https://cmu-otm-demo.netlify.app/'}
  //   >
  //     <Text size="link-1" text="early days of OTM" />
  //   </a>
  // );
  const summaryText = (
    <div>
      <ImageWithCaption src={OTMBanner} caption="One-tap Mobile aka OTM" />
      One-tap Mobile aka OTM has been {OTMMarketingLink}, and it was an honor to
      be put on the project as the prototyper for such a high profile project.
      My goal was to leverage production level components to build the highest
      fidelity proof of concept (mobile only) to not only test out new
      experiences but also to provide the engineers a higher fidelity mock up to
      build off of since the One Tap experience was heavy on interactions and
      content. Over the course of the project, I built multiple iterations of
      the project ranging from sales demos and prototypes for user studies
      leveraging mostly ReactJS but also exploring alternative prototyping
      tooling solutions like FramerX and ProtoPie.
      <br />
      <br />
      Check out the {ForumDemo}! Please view on mobile.
    </div>
  );

  const OTMContent = [
    {
      section: 'Responsibilities',
      content: [
        <List
          ordered
          size="body-1"
          listItems={[
            'Built a dynamic and end to end hi-fidelity prototype',
            'Explored and designed loading state experience',
            'Ideated new interactions',
            'Produced tailor made sales demos for clients',
            'Produced demos for user tests',
            'Leveraged production level react components',
            'Architected a system to change colors and branding for sales demos',
          ]}
        ></List>,
      ],
    },
    {
      section: 'Problem',
      content: [
        <div>
          Blend's vision for 2019 was to drastically change how mortgages could
          be completed: the goal was to try and net a user a preapproval letter
          with ‘one-tap.’ The idea was that, given the right circumstances with
          bank accounts and data all connected, a user could log in on their
          phone when house hunting, and get a preapproval letter instantly.
          Through Blend’s app and if the user had most of their financial
          information and assets in one of Blend’s clients (read as clients like
          Wells Fargo), OTM could process all the information and handle all the
          underwriting to provide a preapproval letter.
        </div>,
      ],
    },
    {
      section: 'Solution & Deliverables',
      content: [
        <div>
          This was a brand new experience that Blend was setting out to test
          out, so I was brought on the Design team as the dedicated prototyper
          to work with design through the flows and the overall experience to
          produce a working {ForumDemo} for user testing as well as a handoff
          item for engineering to reference. OTM is a very intricate experience
          since there is a huge amount of behind the scenes processes that need
          to happen sequentially for the experience to work. The design team had
          to figure out the whole flow (at a high level) from:
        </div>,
        <List
          ordered
          size="body-1"
          listItems={[
            'Logging into their financial institution',
            'Providing consent for OTM',
            'Surfacing a potentially long loading state while OTM fetches and processes data',
            "Showcasing and educating a user's buying power",
            'Produce a preapproval letter',
            'Provide methods for a user to edit or add information to increase their buying power or modify the preapproval letter',
          ]}
        ></List>,
      ],
    },
    {
      section: 'Process',
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
      content={OTMContent}
    />
  );
};

export default OTM;
