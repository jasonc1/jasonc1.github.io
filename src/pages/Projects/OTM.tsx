import React from 'react';
import Projects from '../../components/templates/prose/prose.component';
import { Text } from '../../components/text/text.component';
import { List } from '../../components/list/list.component';
import { ImageWithCaption } from '../../components/ImageWithCaption/ImageWithCaption.component';
import OTMFastCo from '../../assets/images/projects/OTM/OTMFastCo.png';
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
      <Text size="link-1" text="prototype (please view on a mobile device)" />
    </a>
  );
  const RBCDemo = (
    <a
      className="action-link"
      target="_blank"
      rel="noreferrer"
      href={'https://otm-rbc-demo.netlify.app/'}
    >
      <Text size="link-1" text="here (please view on a mobile device)" />
    </a>
  );
  const FramerXDemo = (
    <a
      className="action-link"
      target="_blank"
      rel="noreferrer"
      href={'https://cmu-otm-demo.netlify.app/'}
    >
      <Text size="link-1" text="early days of OTM" />
    </a>
  );
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
      Check out the {ForumDemo}!
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
        <ImageWithCaption
          src={OTMFastCo}
          caption="OTM featured on FastCompany"
        />,
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
        <ImageWithCaption
          src={OTMEmblem}
          iphone
          caption="OTM is a whitelabel solution"
        />,
        <div>
          One of the biggest features of OTM was how everything was done behind
          the scenes, but that meant that there would be possibly a gap of time
          where the user had to wait for OTM to process data and crunch numbers.
          Thus, we had to design a loading experience that ranged from 15 to 30
          seconds that was meaningful to the user - not just some spinner going
          infinitely. Using Lottie, we were able to successfully deliver an
          experience to Engineering as well as use it in our prototype in the
          early stages of design and ideation.
        </div>,
        <ImageWithCaption src={OTMLoading} caption="Loading states for OTM" />,
        <div>
          On top of having to produce a brand new experience, we needed to be
          able to verify the experience through user testing, and we found that
          a click through mock up wasn’t enough: in order to user test the
          experience, the information provided to a user needed to be dynamic.
          Furthermore, we not only wanted to see if this experience was
          feasible, but we wanted to test for user comprehension. The OTM
          experience was going to not only provide a preapproval letter on
          demand, but the hope was to also educate and simplify the home buying
          process for new home buyers as well. Instances of user testing
          include: Authentication and Prefill explorations and Buying Power
          comprehension.
        </div>,
        <div>
          Lastly, since this was a flagship project, the Design department found
          itself having to produce collateral/demos for sales pitches, product
          showcases at conventions, and other marketing material. Thus, the
          prototype was architected in a way so that the demo could be tailor
          made to simulate a branded experience for Blend’s high profile
          clients. You can check out one of the demos for RBC {RBCDemo}.
        </div>,
        <ImageWithCaption
          src={OTMRBC}
          iphone
          caption="OTM branded for a demo for RBC"
        />,
      ],
    },
    {
      section: 'Process',
      content: [
        <div>
          The design and idea of OTM changed over the course of my time
          prototyping for OTM. The designs changed as well as the copy, but
          while those inevitable changes happened, I also changed the technology
          I used.
        </div>,
        <div>
          I started out with FramerX to produce small internal concepts for
          Design to better explore the {FramerXDemo}. Initially, I was just
          curious as to what FramerX was since Framer Classic (rip) was very
          nice to use, and FramerX leveraged ReactJS. However, I found that it
          was very hard to pass data between screens and despite being able to
          leverage production level components, it was very cumbersome,
          inefficient, and not dynamic.
        </div>,
        <ImageWithCaption
          src={OTMFramerX}
          iphone
          caption="OTM in its early days, built with FramerX"
        />,
        <div>
          I moved on to prototyping solely in ReactJS. This was mainly out of
          convenience for leveraging react components and thus it was easier to
          handle data and inputs from users. Moreover, this was also requested
          from Engineering, since they felt that it could be an easier handoff
          since they could reference the ReactJS code when needed. I spent about
          3 weeks of non stop coding to produce a {ForumDemo} that could mock
          the whole experience (with loading state and dynamic inputs).
        </div>,
        <div>
          Later on, I was able to spend some time refactoring the prototype
          (while also making design iterations) so that we could easily change
          the branding color and logo of the prototype. Making the switch to
          prototyping in ReactJS from FramerX made it immensely easy.
          Re-branding a FramerX file would take probably hours while updating
          the code in ReactJS (barring the time it took to do the refactoring
          work) would take roughly 15 minutes. The upfront cost proved to save
          me time since I ended up making 5+ sales demos over the two months
          after.
        </div>,
        <ImageWithCaption
          src={OTMProtopie}
          caption="Authentication and Prefill prototypes for user testing"
        />,
        <div>
          We then moved on to a second iteration of the OTM experience, and the
          design team was looking into ways improve and test the log in and
          prefill experiences for OTM. I found this a good time to try out a new
          tool since the scope of the user testing was much much smaller
          (compared to a whole end to end experience). Thus, I tried out
          ProtoPie, and it was a very pleasant and fast way to make a no-code
          hi-fi prototype. ProtoPie saved me time in creating multiple versions
          of a log in experience (there were 4) and prefill experience (there
          were 3). I made a total of 7 prototypes within the span of a week
          without having to code. It did take some time since there’s a whole
          lot of clicking, but leveraging ProtoPie for this project helped
          inspire designers to try out the tool to create their own prototypes.
          This served as a pilot so that we could empower product designers to
          prototype things on their own and bring me in if they
        </div>,
      ],
    },
  ];
  return (
    <Projects
      title="One-Tap Mobile"
      date="March 2019 - Sept 2019"
      summary={summaryText}
      content={OTMContent}
    />
  );
};

export default OTM;
