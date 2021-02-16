import React from 'react';
import Projects from '../../components/templates/prose/prose.component';
import { Text } from '../../components/text/text.component';
import { Link } from 'react-router-dom';

export const DesignSystemsAtBlend = () => {
  // const Voyage = (
  //   <a
  //     className="action-link"
  //     target="_blank"
  //     rel="noreferrer"
  //     href={'https://vj-type.com/family/voyage/'}
  //   >
  //     <Text size="link-1" text="we used Voyage" />
  //   </a>
  // );
  // const SRLegacy = (
  //   <Link className="action-link" to="/SRLegacy" target="_blank">
  //     <Text size="link-1" text="a previous attempt in 2017 was made" />
  //   </Link>
  // );
  const summaryText = (
    <div>
      As of writing this post, I currently work on Blend’s design system,
      Alchemy, as one of the founding members of the design system. I found
      myself finding a passion towards designs after about a year of bringing
      prototyping to Blend.
    </div>
  );

  const Content = [
    {
      section: 'My journey into design systems',
      content: [
        <div>
          Prior to blend, I got a small glimpse of design systems when I
          contributed to an accordion component for Intuit Design System. During
          my stint working on the accordion component, I got a high level
          understanding of what the benefit is of a component library. I found
          that bigger companies have the resourcing to power a whole team that
          owns a design system with tens of engineers and designers.
        </div>,
        <div>
          As both a consumer and contributor of the design system, I got to
          experience both ends of the system. Furthermore, I discovered what
          requirements are needed to build a component from not only the code
          side but also from the design side. I was exposed to taking a
          component and meeting accessibility requirements like screen reader
          support, keyboard shortcuts, and more. I also got an understanding of
          the process of taking a component from our experimental library and
          graduating it be published as an official component. Lastly, as a
          developer, I got the pleasure of testing, creating, and educating
          other engineers on the component for consumption in other
          applications. Overall, looking back, I’m quite grateful to be able to
          experience that since I can apply my own personal experiences to help
          bring Alchemy to life at Blend. This all happened because I just
          wanted to prototype a component interaction at Intuit, and it thus led
          me down a deep yet rewarding rabbithole.
        </div>,
        <div>
          Continuing my path forward with a passion for prototyping, I joined
          Blend and embarked on a journey to bring prototyping onto Blend’s
          radar. I prototyped One-Tap Mobile (aka OTM) and thus discovered that
          Blend really could use some work on the design systems front. By
          creating high fidelity prototypes via ReactJS, I found the need for a
          design system: being able to use a component library really saves me
          time from recreating already existing components.
        </div>,
        <div>
          However, I soon found that there was much more required for a
          component library: we lacked consistency between design and
          engineering. Colors weren’t the names or even values, we still had the
          majority of our “reusable” components in our monolith, and, worst off
          yet, we lacked a source of truth. While I had to build my prototypes,
          I started finding ways to contribute to help move the needle closer to
          1:1 parity between design and engineering. I tried to help migrate
          components like RadioGroup out of monolith and into our shared
          component library. I added entries for components to Storybook as well
          as documented the available design tokens like color and typography.
        </div>,
        <div>
          Furthermore, I poked around prod and figma through countless audits to
          highlight current design debt. At one point, I even ventured on into
          tackling design debt in production. Notable tasks that got me really
          in the weeds to shovel out all the design debt were: redesigning our
          disabled state for our buttons in our enterprise app, updating
          background colors in production, auditing icon usage, and more. For
          one, I found that we simply don’t have the same names and values for
          color and we were inconsistent with color usage throughout production.
          On top of that, some of our color usage was too low in contrast, so my
          work was to update and fix the design debt. Throughout all of those
          tasks, I was super grateful that I spent some time actually learning
          how to code and get the industry experience as a developer because it
          really paid off since I could design with technical constraints in
          mind. However, back then I did not really know what was needed for a
          system: I kind of just did whatever I could to try and fix things. On
          top of that, I dedicated my time towards some of the design and tech
          debt so that it could help me do my task at hand easier: prototyping.
        </div>,
        <div>
          Roughly about a year into my time at Blend, I made a conscious effort
          to dedicate the majority of my time to learning more about design
          systems and doing my best to help with the effort. I really wanted to
          get more involved on the design front, as I felt that most of my time
          was still in the weeds of code and less so Figma or Sketch. We were
          still in the midst of just testing out Figma before Figma really just
          popped off and became “the future” of design tools. Funnily enough, I
          have grown to become a huge advocate for Figma for not only my own day
          to day but also almost acting like a mini ambassador to our design
          team as I wanted to share the knowledge that I learned through using
          Figma for design systems. However, before that all happened, I felt
          that my time spent in Figma was still quite lacking since I only used
          it to whiteboard prototyping flows and interactions.
        </div>,
        <div>
          An opportunity arose when I found that we were leaning towards
          migrating most of our files to Figma, and two quarters later, we
          committed as a design org that Figma would be our primary tool of
          choice. One of the tasks at hand was to migrate our sketch library for
          our consumer app to Figma. I volunteered myself to block out the two
          to three weeks to migrate every. single. component. I tried to be
          smart about the whole migration process and explored ways of importing
          a Sketch file or simply copying over the assets, but all the line
          heights were all messed up. Thus, we decided to redraw most of the
          components by hand. As for illustrations, we had issues importing from
          Sketch as well, so we had to hunt down the original assets from
          illustrator and export them as svg and import them into Figma.
        </div>,
        <div>
          A few of my coworkers were kind enough to help me along the way with
          the burden (Thanks Iseri and Sara~). On top of that, Iseri taught me
          one of the biggest takeaways of creating a system: figure out the
          goddamn design token. It’s actually one of my fondest memories at
          Blend since I knew nothing about Figma or managing a design library at
          that time, and I was just so excited to learn anything I could. Thus
          birthed Borrower Design System (in Figma), and it slowly became the
          system that I maintained to the best of my abilities as a one man
          team. I spent time uncovering design debt, adding documentation to
          components, learned how Figma components worked, and much much more.
          Over the course of a few quarters, I feel that my time spent migrating
          and maintaining Borrower Design System was put to good use since it
          helped me understand design systems on the design side.
        </div>,
        <div>
          From Borrower Design System, I found my passion to work on design
          systems. Fast forward to now, I’m working on Alchemy Design System.
          All the work I did leading up to Alchemy really helped set me up to be
          able to work on creating a design system for Blend. All the time spent
          auditing, prototyping, and messing around in Figma really paid off
          since it gave me a whole lot of contextual knowledge of our products,
          component libraries, and design files. I would argue that had I not
          started out with prototyping, I would have had much less empathy and
          passion towards design systems. I wouldn’t have been able to
          experience the pain, ask all the annoying questions of “Do we have
          ____ component?” or even “Why is this color different?,” and most
          importantly, I wouldn’t have been able to experience what life is like
          without a proper design system. Keep in mind, prior to blend, I had
          the luxury of consuming a fully staffed and support design system as
          well as the opportunity to contribute to a design system.
        </div>,
        <div>
          At Blend, I gained a whole lot of empathy and understanding the pains
          of not having a design system. I feel like I’ve come a long way, but I
          still have much more to learn. This whole journey has been a moment
          where no matter the challenges I’ve faced, I still really really
          really wanted to work on a design system. For once, I’ve felt that I
          enjoyed every aspect of the job even at its hardest moments. For now,
          this seems like the right path forward, and I’m looking to grow and
          learn everything I can.
        </div>,
      ],
    },
  ];
  return (
    <Projects
      title="Design Systems @ Blend"
      date="November 29th, 2021"
      summary={summaryText}
      content={Content}
    />
  );
};

export default DesignSystemsAtBlend;
