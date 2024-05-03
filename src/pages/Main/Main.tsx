import React from "react";
import { Text } from "../../components/text/text.component";
import "./main.style.scss";
import { useState, useEffect } from "react";
import { theme } from "../../colors.js";
import { IMainProps } from "./Main.model";

// import { Rule } from '../../components/rule/rule.component';
// import { Footer } from '../../components/footer/footer.component';
// import DesignSystems from '../../components/sections/design-systems.component';
// import Prototyping from '../../components/sections/prototyping.component';
// import ToolsAndOps from '../../components/sections/toolsAndOps.component';
// import Photography from '../../components/sections/photography.component';
// import EditorialAndLookbook from '../../components/sections/editorialAndLookbook.component';
// import Contact from '../../components/sections/contact.component';

export const Main = ({ navDisplay, navItems, screenWidth }: IMainProps) => {
  const mobileContent = (
    <>
      <div className="mobile-navDisplay">
        <Text size="Header" text={navDisplay} />
      </div>

      <div className="mobile-content-wrapper">
        <div className="mobile-content-block" id="work">
          <Text size="Body" text={navItems[0]} />
        </div>

        <div className="mobile-content-block" id="photography">
          <Text size="Body" text={navItems[2]} />
        </div>

        <div className="mobile-content-block" id="about">
          <Text size="Body" text={navItems[1]} />
        </div>

        <div className="mobile-content-block last" id="contact">
          <Text size="Body" text={navItems[3]} />
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
        <div className="content-block" id="work">
          <Text size="Header" text={navItems[0]} />
        </div>

        <div className="content-block" id="photography">
          <Text size="Header" text={navItems[2]} />
        </div>

        <div className="content-block" id="about">
          <Text size="Header" text={navItems[1]} />
        </div>

        <div className="content-block last" id="contact">
          <Text size="Header" text={navItems[3]} />
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

    // <div className="main" id="main-selector">
    //   <Nav />
    //   <div className="about main-container" id="scroll-about">
    //     <div className="about-content">
    //       <Text
    //         size="Display"
    //         color={theme.accent}
    //         text="I’m a design technologist, and I love design systems, mechanical keyboards, and analogue photography."
    //         marginBottom={32}
    //       />
    //       <Text
    //         size="Body"
    //         color={theme.accent}
    //         text="Hi, I’m Jason. I used to be a developer, but now I sit at the intersection of design and code. My passion is building and maintaining design systems at the moment, and on the side I create tools for design ops, create high fidelity prototypes, contribute documentation, and much more. "
    //         marginBottom={24}
    //       />
    //       <Text
    //         size="Body"
    //         color={theme.accent}
    //         text="Previously, I have worked at Carta and Blend as a design technologist and Intuit as a software developer. I graduated from  Carnegie Mellon University with a B.S in Information Systems and an additional B.S. in  Human Computer Interaction. "
    //       />
    //     </div>
    //   </div>
    //   <div className="projects main-container" id="scroll-projects">
    //     <DesignSystems />
    //     <ToolsAndOps />
    //     <Prototyping />
    //     <Rule />
    //   </div>
    //   <div className="photography main-container" id="scroll-photography">
    //     <Photography />
    //     <EditorialAndLookbook />
    //     <Rule />
    //   </div>
    //   <div className="contact main-container" id="scroll-contact">
    //     <div>
    //       <Contact />
    //       <Rule />
    //     </div>

    //     <Footer color={theme.accent} />
    //   </div>
    // </div>
  );
};
