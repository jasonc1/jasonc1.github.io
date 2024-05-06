import React from "react";
import { Text } from "../../components/text/text.component";
import "./main.style.scss";
import { useState, useEffect } from "react";
import { theme } from "../../colors.js";
import { IMainProps } from "./Main.model";
import { WorkBlock } from "../../components/WorkBlock/WorkBlock.component";
import { PhotoBlock } from "../../components/Blocks/PhotoBlock";
import { AboutBlock } from "../../components/Blocks/AboutBlock";
import { ContactBlock } from "../../components/Blocks/ContactBlock";
import { IWorkBlockProps } from "../../components/WorkBlock/WorkBlock.model";
import BluebookLogo from "../../assets/images/Bluebook.png";
import InkLogo from "../../assets/images/Ink.png";
import VestaLogo from "../../assets/images/Vesta.png";
import AlchemyLogo from "../../assets/images/Alchemy.png";
import IDSLogo from "../../assets/images/IDS.png";

// import { Rule } from '../../components/rule/rule.component';
// import { Footer } from '../../components/footer/footer.component';
// import DesignSystems from '../../components/sections/design-systems.component';
// import Prototyping from '../../components/sections/prototyping.component';
// import ToolsAndOps from '../../components/sections/toolsAndOps.component';
// import Photography from '../../components/sections/photography.component';
// import EditorialAndLookbook from '../../components/sections/editorialAndLookbook.component';
// import Contact from '../../components/sections/contact.component';

const bluebook: IWorkBlockProps = {
  detail: {
    project: "Bluebook design system",
    company: "Everlaw",
    role: "Lead product desinger",
    duration: "2023 - present",
    description:
      "Lead the Bluebook design system effort, evolved engineering and design collaboration & processes, migrated documentation to storybook, spearheaded planning, and delivered key components.",
    img: BluebookLogo,
    alt: "Bluebook logo",
  },
};

const ink: IWorkBlockProps = {
  detail: {
    project: "Ink design system",
    company: "Carta",
    role: "Design technologist",
    duration: "Oct 2021 - Sep 2022",
    description:
      "Spearheaded the “Ink on Figma” library and led a cross functional working group to actively maintain the Figma design system. Coded and shipped multiple production components per quarter as well as rapid prototyping for feasibility tests.",
    img: InkLogo,
    alt: "Ink logo",
  },
};

const vesta: IWorkBlockProps = {
  detail: {
    project: "Vesta design system",
    company: "Vesta",
    role: "Design technologist",
    duration: "Mar 2022 - Sep 2022",
    description:
      "Established Vesta’s initial design system with atomic design principles. Audited existing components and engineering patterns to create Figma designs in parity.",
    img: VestaLogo,
    alt: "Vesta logo",
  },
};

const alchemy: IWorkBlockProps = {
  detail: {
    project: "Alchemy design system",
    company: "Blend",
    role: "Design technologist",
    duration: "Feb 2019 - Oct 2021",
    description:
      "Co-created, maintained, and contributed to the Alchemy design system, a unified component library used across Blend's multiple product lines. Designed and built a variety of tools to help designers do their best work. Tools included Figma plugins, custom applications, documentation, and more.",
    img: AlchemyLogo,
    alt: "Alchemy logo",
  },
};

const ids: IWorkBlockProps = {
  detail: {
    project: "Intuit design system",
    company: "Intuit",
    role: "Software engineer",
    duration: "Aug 2017 - Jan 2019",
    description:
      "UI Developer working in React + Redux on the Payments Onboarding experience for Quickbooks. Built and owned product vertical specific components as well as those shared out in the Intuit Design System.",
    img: IDSLogo,
    alt: "IDS logo",
  },
};

const work = (
  <>
    <WorkBlock detail={bluebook.detail} />
    <WorkBlock detail={ink.detail} />
    <WorkBlock detail={vesta.detail} />
    <WorkBlock detail={alchemy.detail} />
    <WorkBlock detail={ids.detail} />

    <div className="work-short-block" id="prototyping-block">
      <Text size="Header" text="Prototyping" />
      <div className="item-row">
        <Text size="Body-bold" text="Carta employee onboarding /" />
        <Text
          size="Body"
          text="Three end to end prototypes were created to test a new 2FA flow and subsequently leveraged for user tests."
        />
      </div>
      <div className="item-row">
        <Text size="Body-bold" text="Carta exercise status /" />
        <Text
          size="Body"
          text="The task was to revamp the exercise status for more transparency behind the status as opposed to simply saying 'pending' or 'cancelled.'"
        />
      </div>
      <div className="item-row">
        <Text size="Body-bold" text="Blend one tap mobile /" />
        <Text
          size="Body"
          text="Prototyped high fidelity interactions via react to iterate and refine to provide assets for engineering as well as showcase demos."
        />
      </div>
      <div className="item-row">
        <Text size="Body-bold" text="Blend Insurance Wait Task V2 /" />
        <Text
          size="Body"
          text="Prototyped a loading multi-step experience with css transitions and animations to flesh out microinteractions for handoff for engineering."
        />
      </div>
    </div>

    <div className="work-short-block" id="tooling-block">
      <Text size="Header" text="Tooling" />
      <div className="item-row">
        <Text size="Body-bold" text="Sapling /" />
        <Text
          size="Body"
          text="Sapling is a figma plugin that creates a set page structure and cover page for new figma files. Think of it as a figma file initializer."
        />
      </div>
      <div className="item-row">
        <Text size="Body-bold" text="Haven /" />
        <Text
          size="Body"
          text="Haven is a figma plugin I built to help product designers document and protect their explorations and archived screens as well as tagging screens for better handoff. Haven was a small side project and an opportunity to explore tooling for the Product design team within Figma."
        />
      </div>
      <div className="item-row">
        <Text size="Body-bold" text="Abstract migrate /" />
        <Text
          size="Body"
          text="During the days of sunsetting Sketch + Abstract to move on to Figma, I wrote a script leveraging Abstract's API to migrate ~750 legacy files off of the platform, thus saving 100s of hours doing it manually."
        />
      </div>
    </div>
  </>
);
const photo = (
  <>
    <PhotoBlock />
  </>
);
const about = (
  <>
    <AboutBlock />
  </>
);
const contact = (
  <>
    <ContactBlock />
  </>
);

export const Main = ({ navDisplay, navItems, screenWidth }: IMainProps) => {
  const mobileContent = (
    <>
      <div className="mobile-navDisplay">
        <Text size="Header" text={navDisplay} />
      </div>

      <div className="mobile-content-wrapper">
        <div className="mobile-content-block" id="Work">
          {work}
        </div>

        <div className="mobile-content-block" id="Photography">
          {photo}
        </div>

        <div className="mobile-content-block" id="About">
          {about}
        </div>

        <div className="mobile-content-block last" id="Contact">
          {contact}
        </div>
      </div>
    </>
  );

  const content = (
    <div className="content">
      <div className="content-sidebar">
        <div id="content-title">
          <Text size="Header" text={navDisplay} />
        </div>
      </div>
      <div className="content-main">
        <div className="content-block" id="Work">
          {work}
        </div>

        <div className="content-block" id="Photography">
          {photo}
        </div>

        <div className="content-block" id="About">
          {about}
        </div>

        <div className="content-block last" id="Contact">
          {contact}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="body">
        {screenWidth >= 1200 ? content : mobileContent}
      </div>
    </>
  );
};
