import React from "react";
import Projects from "../../../components/templates/prose/prose.component";
import { Text } from "../../../components/text/text.component";
import { List } from "../../../components/list/list.component";
import { ImageWithCaption } from "../../../components/ImageWithCaption/ImageWithCaption.component";
import SR_cover from "../../../assets/images/projects/StratRoulette/SR_cover.png";
import roll_strat from "../../../assets/images/projects/StratRoulette/roll_strat.png";
import roll_strat_mobile from "../../../assets/images/projects/StratRoulette/roll_strat_mobile.png";
import colors from "../../../assets/images/projects/StratRoulette/colors.png";
import landing_info from "../../../assets/images/projects/StratRoulette/landing_info.png";
import roulette_form_inputs from "../../../assets/images/projects/StratRoulette/roulette_form_inputs.png";
import typography from "../../../assets/images/projects/StratRoulette/typography.png";
import SRLegacy_alpha from "../../../assets/images/projects/SRLegacy/SRLegacy_alpha.png";
import { Link } from "react-router-dom";

const legacy = (
  <Link className="action-link" to="/DocUploader" target="_blank">
    <Text
      size="Body-bold"
      text="👉 Click here if you want to read more about SR legacy"
    />
  </Link>
);

export const StratRoulette = () => {
  const summaryText = `StratRoulette (SR) has been a side project that I've been working on with
      my good friend Justin Chen. SR has been a meaningful success for Justin
      with it's first launch back in 2013, and we've been working on it during
      the start of the COVID-19 pandemic to redesign and re-haul the whole UI as
      well as backend. I serve as design lead but my main focus is still design
      systems, where I create and build the component library.`;

  const StratRouletteContent = [
    {
      section: "Responsibilities",
      content: [
        <List
          size="Body"
          listItems={[
            "Designed and implemented components for design system",
            "Designed all the flows and interactions of the app (mobile + desktop)",
            "Created logo, brand identity, and landing page",
            "Main driver of product and design strategy",
          ]}
        ></List>,
      ],
    },
    {
      section: "Problem",
      content: [
        <ImageWithCaption
          src={SRLegacy_alpha}
          caption="StratRoulette in it's early days"
        />,
        <Text
          size="Body"
          marginBottom={16}
          text={`SR has been around since 2013, and it was in dire need of a design
              rehaul. A previous attempt was made in 2017, but failed due to
              various reasons, but when the COVID-19 pandemic hit as well as a
              few years of experience gained, we all found a huge amount of time
              in our hands, and we thus decided to commit to not only a redesign
              of the application, but also improve and scale the app.`}
        />,
        legacy,
      ],
    },

    {
      section: "Process",
      content: [
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

        <ImageWithCaption
          src={landing_info}
          caption="StratRoulette's info section on the landing page."
        />,

        <ImageWithCaption
          src={roll_strat}
          caption="StratRoulette's roll strat screen displaying a strat card."
        />,
        <ImageWithCaption
          src={roll_strat_mobile}
          caption="StratRoulette's roll strat page on mobile"
        />,
      ],
    },
  ];

  return (
    <Projects
      title="StratRoulette"
      date="March 2020 - Present"
      summary={summaryText}
      image={SR_cover}
      image_caption="StratRoulette is a platform where users can submit strats to a community for various competitive e-sports games like CounterStrike, Valorant, and more."
      content={StratRouletteContent}
    />
  );
};

export default StratRoulette;
