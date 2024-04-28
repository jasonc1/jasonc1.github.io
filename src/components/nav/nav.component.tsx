import React, { useEffect } from "react";
import { Text } from "../../components/text/text.component";
import "./nav.style.scss";
import { theme } from "../../colors.js";

const customScrollTo = (id: string) => {
  const element = document.getElementById(id);
  const yOffset = -72;
  if (element) {
    const y =
      element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
};

export const Nav = () => {
  const clickProjects = () => {
    // document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
    customScrollTo("work");
  };
  const clickAbout = () => {
    // document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
    customScrollTo("about");
  };
  const clickPhotography = () => {
    // document
    //   .getElementById("photography")
    //   ?.scrollIntoView({ behavior: "smooth" });
    customScrollTo("photography");
  };
  const clickContact = () => {
    // document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    customScrollTo("contact");
  };

  return (
    <nav className="display-nav">
      <Text
        marginLeft={24}
        size="Display"
        color={theme.primary}
        text="Jason Chen"
        id="display-name-gradient"
      />
      <div className="center-detail">
        <Text size="Header" color={theme.primary} text="Design Systems / SF" />
      </div>
      <ul className="nav-menu">
        <li id="nav-projects" onClick={clickProjects}>
          <Text size="Header" color={theme.primary} text="Work" />
        </li>
        <li id="nav-photography" onClick={clickPhotography}>
          <Text size="Header" color={theme.primary} text="Photo" />
        </li>
        <li id="nav-about" onClick={clickAbout}>
          <Text size="Header" color={theme.primary} text="About" />
        </li>
        <li id="nav-contact" onClick={clickContact}>
          <Text size="Header" color={theme.primary} text="Contact" />
        </li>
      </ul>
    </nav>
  );
};
