import React from 'react';
import Projects from '../../components/templates/prose/prose.component';
import { ImageWithCaption } from '../../components/ImageWithCaption/ImageWithCaption.component';
import accordion_tron from '../../assets/images/projects/intuit/accordion_tron.gif';
import OTMBanner from '../../assets/images/projects/OTM/OTMBanner.png';
import intake_form from '../../assets/images/projects/misc/intake_form.png';

import { Text } from '../../components/text/text.component';
import { Link } from 'react-router-dom';

export const PrototypingAtBlend = () => {
  const bankerProto = (
    <a
      className="action-link"
      target="_blank"
      rel="noreferrer"
      href={'https://cb-banker-v1.netlify.app/'}
    >
      <Text
        size="link-1"
        text="deposit account prototype for bankers to user test"
      />
    </a>
  );
  const IDSAccordion = (
    <Link className="action-link" to="/IDSAccordion" target="_blank">
      <Text size="link-1" text="accordion" />
    </Link>
  );
  const OTM = (
    <Link className="action-link" to="/OTM" target="_blank">
      <Text size="link-1" text="One Tap Mobile (OTM)" />
    </Link>
  );
  const WaitTaskV2 = (
    <Link className="action-link" to="/WaitTaskV2" target="_blank">
      <Text size="link-1" text="Wait Task V2" />
    </Link>
  );
  const summaryText = (
    <div>
      For the last half of college, I was really interested in the prototyping
      space while I was completing my double major in Human Computer
      Interaction. I did enjoy creating responsive websites and creating web
      applications, but I wanted to focus on creating high fidelity prototypes.
      I thought the space was super new, and I heard about Framer Classic, but
      never got a chance to try it until much much later. Throughout most of my
      classes, I was exposed to either click through prototyping tools like
      InVision or simply just slapping together an html, css, javascript/jquery
      application that served as a prototype, in which I was quite accustomed
      to. I found it hard to find a role as a ‘prototyper’ right out of college
      since most of the roles that were available to me at the time were ‘UI/UX
      designer’ or ‘software engineer.’ It’s only until the more recent years in
      which I have started to see and learn more about the design technologist
      role. I thus made a conscious decision to become a software engineer with
      the hopes of getting professional and industry experience creating UIs
      with ReactJS. I felt that if I had a stronger technical background, it
      would help me become a better designer. If I know how something is made or
      how certain technical limitations impact design, I felt that I could then
      do something related to product design, which would then entail
      prototyping. As you can see, there were a few steps there, and I would say
      for about a year, I was dead set on becoming a product designer. I spent
      days shadowing product designers inside and outside of work, seeking
      mentorship, and just preparing my portfolio so that I could get my foot in
      the door.
    </div>
  );

  const Content = [
    {
      section: "Putting prototyping on Blend's radar",
      content: [
        <ImageWithCaption
          src={accordion_tron}
          caption="The Intuit Design Systems Accordion seen in Payments Onboarding with Chase in production"
        />,
        <div>
          During my time at Intuit, I found an opportunity to prototype: I was
          working on an {IDSAccordion} component for Intuit design system and
          when I was given the mocks from design, all I saw was the ‘expanded’
          and ‘collapsed’ states. My initial thought was to sit with the
          designers and just ask all the questions I could think of. What
          happens in between the expand/collapse states? How long is the
          transition? What fades in and what fades out? So on and so forth. I
          felt that this would be a good time to try out Framer Classic since
          that was the ‘best’ tool on the market out there, and I wanted to mock
          the experience before coding it. It proved to be helpful since I could
          figure out all the transitions, timings, and overall experience in
          Framer Classic while not having to code the real thing. I could easily
          change values as well to workshop the interaction in real time with
          the designers. This process of working collaboratively with designers
          and rapidly iterating on an interaction got me excited, and I wanted
          to do more of that.
        </div>,
        <div>
          Fast forward a year, I embarked on my journey as a design technologist
          at Blend. What happened to my goal to switch to becoming a product
          designer? Well, I interviewed at Blend as a product designer, but I
          wasn’t quite there yet in terms of experience. I was very interested
          in prototyping as a function and just building concepts fast. To
          blend, I was able to add immediate value by helping out and building
          prototypes and demos. That sounded amazing to me, and despite going
          into a role that I knew nothing about going into it, I don’t regret
          any of that decision. I had no idea what design technology was at the
          time, and quite frankly, I wasn’t sure if that was the right step for
          me. However, I saw that I was given a chance to work on projects that
          I could use my coding background to help iterate and flesh out
          designs, so I decided to take the role and try it out.
        </div>,
        <div>
          At Blend, my first few months were spent just exploring tooling for
          prototyping. I wasn’t quite convinced that coding a prototype would be
          the best or optimal option since tools like Framer Classic existed and
          at that time Framer X just launched. I was super excited to try out
          Framer X since leverages and incorporates ReactJS to make high
          fidelity prototypes like this {bankerProto}. However, I found it to be
          quite painful to use due to the lack of documentation and lack of a
          few key features: passing data between screens, state management,
          automatic page transitions (on load or with a setTimeout), and much
          much much more. Despite the massive disappointment, I always kept
          FramerX in the back of my head and tried to give it a chance over the
          years. However, it ultimately morphed into a tool that I felt that did
          not meet my needs.
        </div>,
        <ImageWithCaption src={OTMBanner} caption="One-tap Mobile aka OTM" />,
        <div>
          My main goal for prototyping remained the same regardless of if I used
          FramerX, code, or another tool like ProtoPie (in which I will talk
          about later): I really wanted to leverage code components to create
          prototypes of the highest fidelity without having to remake or fake
          prod level components with their interactions. I felt that high
          fidelity prototypes should feel as real as possible, and I wanted to
          use my technical background to make that a reality. I was able to
          produce various prototypes like One Tap Mobile (OTM), a prototype used
          for sales demos and user tests for Blend’s one tap mortgage
          pre-approval solution, or Wait Task V2, an interactive loading state.
        </div>,
        <div>
          Over time, I was able to leverage Blend’s component library (in code)
          to create prototypes quickly. When I first started out, there was only
          a button, textbox, and a few other trivial components available in
          consumer-components, one of blend’s component libraries. I found that
          I needed at least a button, textinput, radio, and checkbox in order to
          make flows quickly in code. Thus, I hacked together some components
          from the monolith to have such components readily available in my
          prototypes. I was able to demonstrate a fast turn-around time for
          coded prototypes, in a matter of one or two weeks on average. I found
          that I excelled in working with designers to workshop ideas, call out
          inconsistencies within designs, and encourage designers to think
          beyond static screens.
        </div>,
        <div>
          I was able to create a framework to make mobile web prototypes faster
          as well, mainly for my own sake, but also if anyone else came around
          to wanting to prototype with code, there was a repo readily available
          for consumption. The framework existed as just a simple git repo that
          I could clone whenever I wanted to make a new prototype in which I
          would deploy separately on netlify: that way, I could keep maintaining
          or make changes when necessary. The framework included my basic
          components that I used regularly, support to change theme/color and
          branding easier for sales demos, have webpack and sass configured so I
          didn’t have to run create react app every single time. I was also able
          to leverage lottie for various loading states present in some of the
          prototypes I worked with. These prototypes were meant to be as real as
          possible so the use of Lottie helped us create and iterate on
          animations faster. Furthermore, the inclusion of code made data input
          as well as data processing on each prototype much much easier.
        </div>,
        <div>
          Over the course of a couple of quarters of heads down work, I was also
          able to establish prototyping as a part of the design workflow. My
          focus was to essentially help the design team prototype flows and
          incorporate prototypes into their workflow (given the right scope and
          resourcing). Through that, I was able to establish a process for
          working with designers for prototyping as well as taking requests from
          cross functional partners such as product managers and people from the
          business development side of things.
        </div>,
        <ImageWithCaption
          src={intake_form}
          caption="Prototyping intake form for our XFN partners"
        />,

        <div>
          My manager and I created an intake form for both XFN partners as well
          as designers to send in prototyping requests when needed. On top of
          that, we were able to establish a pre-read for XFN partners to
          thoroughly think through their asks while considering time/cost
          tradeoffs as well as having an understanding of what fidelity
          prototypes and solutions we have available. One of the biggest points
          of contention was that I was the only prototyping resource for Blend,
          so it wasn’t viable to have me code all of my prototypes.
        </div>,
        <div>
          Having a pipeline/process as to what projects I prototype for as well
          as helping designers and XFN members understand what solutions we have
          and what tradeoffs come along with each solution really helped my job.
          We found that this process helped our partners identify what kind of
          prototype they desired (click through, coded, etc), what the timeline
          was, and what the purpose of the prototype was. We found that there
          were typically two buckets of prototypes: sales demos and prototypes
          for user testing. We were thus able to not only create high fidelity
          prototypes in a quick manner but also educate the design team as well
          as the company about what the capabilities of prototyping are as well
          as what kinds of solutions and prototypes are available.
        </div>,
        <div>
          From there, I felt that I wanted to empower the design team and help
          make prototyping a bit more self serve. I had an opportunity to listen
          in on a webinar created by the Nielsen Norman Group called
          “Prototyping with Functional Fidelity in Mind”. The goal was to
          ultimately help me learn more about prototyping and how to refine and
          improve my process when it comes to working with partners for a
          prototype. However, I felt that this could be a great way to further
          educate the design team as to how to aid the with the collaboration
          process when it comes to requesting specific prototypes. Through the
          webinar, I was able to share out with the team that we need to
          consider visual, content, and functional fidelity when considering
          creating a prototype. Furthermore, the goal was to educate designers
          the types of trade offs when it comes to using certain methods or
          tools for prototyping as well as characteristics of what a high
          functional fidelity prototype entails.
        </div>,
        <div>
          Beyond the seminar, my goal for prototyping at blend was to also help
          empower product designers to prototype on their own. Continuing my
          explorations with prototyping tools, I came across ProtoPie, and I
          found it to be a fairly decent no-code tool to help designers create
          prototypes with high functional fidelity. ProtoPie ultimately lets you
          create/store variables and have textInput fields and custom inputs
          without having to write a single line of code. I thus tried using
          ProtoPie for a user study for OTM and found it quite straightforward
          to use. From that, my manager and I set out to pilot ProtoPie for the
          product design team as we found it to be a good avenue for product
          designers at Blend to try and prototype on their own. If they required
          help, I could help consult, and that would thus free up my time to
          create more intricate or complex prototypes via code. We fundamentally
          felt that designers should not be required to code, but we could at
          least help designers get closer to producing prototypes without having
          to code. We strongly encourage designers to know how to code, but
          given the nature of working at a lively startup, we don’t always have
          the time to do so. With ProtoPie, I found that it checked off all the
          features that FramerX required as well as abstracting programming
          concepts to make it more accessible.
        </div>,
        <div>
          The introduction of ProtoPIe has served to be a quick and easy way to
          test interactions for the product design team and serves as a tangible
          way for the design technology team to help bring prototyping on
          Blend’s radar beyond my skills. That’s about it for my prototyping
          journey at Blend for now! I’ve thus moved on to working on design
          systems at Blend, and have taken a small break from prototyping at
          this time. Have questions? Drop me a line! I’m more than happy to
          chat.
        </div>,
      ],
    },
  ];
  return (
    <Projects
      title="Prototyping @ Blend"
      date="January 6th, 2021"
      summary={summaryText}
      content={Content}
    />
  );
};

export default PrototypingAtBlend;
