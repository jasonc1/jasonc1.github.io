import { Text } from "../../components/text/text.component";
import "./main.style.scss";
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
import { PrototypingBlock } from "../../components/WorkBlock/PrototypingBlock.component";
import { ToolingBlock } from "../../components/WorkBlock/ToolingBlock.component";

// import { Rule } from '../../components/rule/rule.component';
// import { Footer } from '../../components/footer/footer.component';
// import DesignSystems from '../../components/sections/design-systems.component';
// import Prototyping from '../../components/sections/prototyping.component';
// import ToolsAndOps from '../../components/sections/toolsAndOps.component';
// import Photography from '../../components/sections/photography.component';
// import EditorialAndLookbook from '../../components/sections/editorialAndLookbook.component';
// import Contact from '../../components/sections/contact.component';

const bluebook: IWorkBlockProps = {
  link: "bluebook",
  detail: {
    project: "Bluebook design system",
    company: "Everlaw",
    role: "Lead product designer",
    duration: "2023 - present",
    description:
      "Lead the Bluebook design system effort, evolved engineering and design collaboration & processes, migrated documentation to storybook, spearheaded planning, and delivered key components.",
    img: BluebookLogo,
    alt: "Bluebook logo",
  },
};

const ink: IWorkBlockProps = {
  link: "ink",
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
  link: "vesta",
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
  link: "alchemy",
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
  link: "ids",
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
    <WorkBlock detail={bluebook.detail} link={bluebook.link} />
    <WorkBlock detail={ink.detail} link={ink.link} />
    <WorkBlock detail={vesta.detail} link={vesta.link} />
    <WorkBlock detail={alchemy.detail} link={alchemy.link} />
    <WorkBlock detail={ids.detail} link={ids.link} />
    <PrototypingBlock />
    <ToolingBlock />
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
        <div className="mobile-content-block" id={navItems[0]}>
          {work}
        </div>

        <div className="mobile-content-block" id={navItems[1]}>
          {photo}
        </div>

        <div className="mobile-content-block" id={navItems[2]}>
          {about}
        </div>

        <div className="mobile-content-block last" id={navItems[3]}>
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
        <div className="content-block" id={navItems[0]}>
          {work}
        </div>

        <div className="content-block" id={navItems[1]}>
          {photo}
        </div>

        <div className="content-block" id={navItems[2]}>
          {about}
        </div>

        <div className="content-block last" id={navItems[3]}>
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
