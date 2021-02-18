import React from 'react';
import Projects from '../../components/templates/prose/prose.component';
import { Text } from '../../components/text/text.component';
import { List } from '../../components/list/list.component';
import { ImageWithCaption } from '../../components/ImageWithCaption/ImageWithCaption.component';
import SR_cover from '../../assets/images/projects/StratRoulette/SR_cover.png';
import roll_strat from '../../assets/images/projects/StratRoulette/roll_strat.png';
import roll_strat_mobile from '../../assets/images/projects/StratRoulette/roll_strat_mobile.png';
import colors from '../../assets/images/projects/StratRoulette/colors.png';
import landing_info from '../../assets/images/projects/StratRoulette/landing_info.png';
import roulette_form_inputs from '../../assets/images/projects/StratRoulette/roulette_form_inputs.png';
import typography from '../../assets/images/projects/StratRoulette/typography.png';
import SRLegacy_alpha from '../../assets/images/projects/SRLegacy/SRLegacy_alpha.png';
import { Link } from 'react-router-dom';

export const StratRoulette = () => {
  const Voyage = (
    <a
      className="action-link"
      target="_blank"
      rel="noreferrer"
      href={'https://vj-type.com/family/voyage/'}
    >
      <Text size="link-1" text="we used Voyage" />
    </a>
  );
  const SRLegacy = (
    <Link className="action-link" to="/SRLegacy" target="_blank">
      <Text size="link-1" text="a previous attempt in 2017 was made" />
    </Link>
  );
  const summaryText = (
    <div>
      <ImageWithCaption
        src={SR_cover}
        caption="StratRoulette is a platform where users can submit strats to a community for various competitive e-sports games like CounterStrike, Valorant, and more."
      />
      StratRoulette (SR) has been a side project that I've been working on with
      my good friend Justin Chen. SR has been a meaningful success for Justin
      with it's first launch back in 2013, and we've been working on it during
      the start of the COVID-19 pandemic to redesign and re-haul the whole UI as
      well as backend. I serve as design lead but my main focus is still design
      systems, where I create and build the component library.
    </div>
  );

  const StratRouletteContent = [
    {
      section: 'Responsibilities',
      content: [
        <List
          size="body-1"
          listItems={[
            'Designed and implemented components for design system',
            'Designed all the flows and interactions of the app (mobile + desktop)',
            'Created logo, brand identity, and landing page',
            'Main driver of product and design strategy',
          ]}
        ></List>,
      ],
    },
    {
      section: 'Problem',
      content: [
        <ImageWithCaption
          src={SRLegacy_alpha}
          caption="StratRoulette in it's early days"
        />,
        <div>
          SR has been around since 2013, and it was in dire need of a design
          rehaul. A {SRLegacy}, but failed due to various reasons, but when the
          COVID-19 pandemic hit as well as a few years of experience gained, we
          all found a huge amount of time in our hands, and we thus decided to
          commit to not only a redesign of the application, but also improve and
          scale the app.
        </div>,
      ],
    },
    {
      section: 'Solution & Deliverables',
      content: [
        <div>
          With my background and passion in design systems, I wanted to focus on
          creating a component library from the ground up. I also wanted to use
          SR as an outlet for me to work on something a bit more creative and
          with full autonomy within the design realm. I really just wanted an
          excuse to pick a sick typeface, {Voyage}, pick out a few colors, and
          build a bunch of components while making all the design decisions.
        </div>,
        <div>
          Basically, I wanted to just build an application with ui elements that
          I found interesting from work or just randomly browsing the internet.
          A big part of this was also to just revisit my work from 2017, and
          really just “do better” because, oh boy, it was really really bad. I
          didn’t know a single thing about line height, font size, spacing,
          sizing, and much more. I really wanted to apply all the things that I
          learned from design systems and apply it to SR as an exercise for me
          to grow. I really wanted to just build something from the ground up on
          both design and code to really get a feel of what it’s like to build
          and maintain a system. I really wanted to use this as a learning
          experience for me with the hopes of me leveraging this experience and
          learnings for work.
        </div>,
        <div>
          I really wanted to hone in on the visual language for SR and just run
          wild with whatever I wanted to do. More importantly, I was able to
          then use those components to design screens for both mobile and
          desktop audiences. I was able to produce not only a design system but
          also a brand and a whole application.
        </div>,
      ],
    },
    {
      section: 'Process',
      content: [
        <div>
          The first few tasks for SR were free-form since I got a start at
          revamping the project before some of the team members joined.
          Therefore, I first started out with creating the logo since I really
          did not like the old one. Furthermore, I wanted to pick out the
          branding and design language of the application. During that time, I
          was working at Blend, and most of Blend’s application was white-label.
          Thus, I wanted to be able to pick out colors, typeface, and other
          design elements.
        </div>,
        <div>
          Once the colors, typeface, and design elements were figured out, I
          decided to create a logo. I tried to stick with something simple with
          the thought of having an icon that served as a monogram with a branded
          color while also making considerations for monochrome. As for type, I
          really just fell in love with Voyage, and was really into the trend of
          having a serif header/display font. Color was really just arbitrary,
          but I was feeling a light purple at the time, and I certainly did not
          want a blue color since most fin-tech startups use blue. Red, green,
          and yellow, really did not vibe with me since they reflect error,
          success, and warning colors respectively.
        </div>,
        <ImageWithCaption
          src={colors}
          caption="StratRoulette's color system"
        />,
        <ImageWithCaption
          src={typography}
          caption="StratRoulette's type ramp showcasing Voyage for Display text Inter for body and subheaders"
        />,
        <ImageWithCaption
          src={roulette_form_inputs}
          caption="Roulette design system's form inputs."
        />,
        <div>
          For most of the project, SR’s design and product decisions were driven
          by Justin and me. Justin created various product specs, and during the
          design phase, we would discuss features and how they would work.
          Features would entail supporting and improving legacy features and
          also new features to improve the overall application experience.
          Before designing screens/flows, I first created a base set of
          components
        </div>,

        <div>
          I explored concepts for the type ramp since I knew that the main focus
          of the application was the strat card. This was the whole basis of SR
          - provide a user a ‘strat’ to play for a game. Additionally, I was
          able to explore concepts for the brand page as well as basic input
          components to land on a type ramp. Colors were quite arbitrary since I
          made the decision to keep the application simple and only have one
          primary color and eventually adding an accent color. Neutral colors
          were selected and checked for contrast to meet AA WCAG compliance. We
          decided to go with the standard 8px grid to create most of our
          elements.
        </div>,

        <div>
          Once the fundamental design elements were created, I then started
          designing basic inputs like buttons, radio, and others to thus have
          some components to work with when designing flows. I figured that it’d
          be much faster to design screens when I had at least the design tokens
          and a few components figured out as opposed to designing both
          components and flows at the same time.
        </div>,
        <ImageWithCaption
          src={landing_info}
          caption="StratRoulette's info section on the landing page."
        />,
        <div>
          Prior to working on the core product, I also took some time to work on
          the landing page because I was super inspired company landing pages
          and I just wanted to run wild with a concept. I really just wanted to
          make something simple yet aesthetic in my own way. I was able to
          design and implement the brand page, and it was a blast to run wild on
          the design and code fronts.
        </div>,
        <ImageWithCaption
          src={roll_strat}
          caption="StratRoulette's roll strat screen displaying a strat card."
        />,
        <ImageWithCaption
          src={roll_strat_mobile}
          caption="StratRoulette's roll strat page on mobile"
        />,
        <div>
          After the brand page, I focused solely on designing flows ranging from
          logging in to rolling a strat. Alongside designing, I also began
          developing components for the design system. We tried to parallelize
          designing of features as well as coding components so that we could
          build pages faster later. Therefore, we set out features each week
          that we wanted to tackle, and beforehand, we would call out what
          components needed to be implemented before the feature could then be
          developed. Additionally, we added the design tokens in code and made
          sure those were ready before we could create components. Each feature
          was then designed, components were coded and added to storybook, and
          then pages were coded.
        </div>,
      ],
    },
  ];

  return (
    <Projects
      title="StratRoulette"
      date="March 2020 - Present"
      summary={summaryText}
      content={StratRouletteContent}
    />
  );
};

export default StratRoulette;
