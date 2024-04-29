import React from "react";
import { Text } from "../../components/text/text.component";
import "./main.style.scss";
import { useState, useEffect } from "react";
import { theme } from "../../colors.js";
import { Nav } from "../../components/nav/nav.component";
import { Footer } from "../../components/footer/footer.component";

// import { Rule } from '../../components/rule/rule.component';
// import { Footer } from '../../components/footer/footer.component';
// import DesignSystems from '../../components/sections/design-systems.component';
// import Prototyping from '../../components/sections/prototyping.component';
// import ToolsAndOps from '../../components/sections/toolsAndOps.component';
// import Photography from '../../components/sections/photography.component';
// import EditorialAndLookbook from '../../components/sections/editorialAndLookbook.component';
// import Contact from '../../components/sections/contact.component';

const navItems = ["Work", "About", "Photography", "Contact"];

export const Main = () => {
  const [navDisplay, setNavDisplay] = useState(navItems[0]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const elementInViewport = (element: HTMLElement) => {
    const bounding = element.getBoundingClientRect();
    const elementHeight = element.offsetHeight;
    const elementWidth = element.offsetWidth + window.screen.width / 4;

    if (
      bounding.top >= -elementHeight - window.screen.height / 3 &&
      bounding.left >= -elementWidth - window.screen.height &&
      bounding.right <=
        (window.innerWidth || document.documentElement.clientWidth) +
          elementWidth +
          -window.screen.height &&
      bounding.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) +
          elementHeight +
          -window.screen.height / 3
    ) {
      console.log(element.textContent);
      setNavDisplay(element.textContent ? element.textContent : "null");
    } else {
    }
  };

  useEffect(() => {
    const workElement = document.getElementById("work")!;
    const aboutElement = document.getElementById("about")!;
    const photographyElement = document.getElementById("photography")!;
    const contactElement = document.getElementById("contact")!;
    const handleScroll: EventListener = (event: Event) => {
      elementInViewport(workElement);
      elementInViewport(aboutElement);
      elementInViewport(photographyElement);
      elementInViewport(contactElement);
    };

    const win: Window = window;
    win.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mobileContent = (
    <>
      <div className="mobile-navDisplay">
        <Text size="Header" text={navDisplay} />
      </div>

      <div>
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
        <Nav screenWidth={screenWidth} />
        {screenWidth >= 1200 ? content : mobileContent}
      </div>
      <Footer />
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
