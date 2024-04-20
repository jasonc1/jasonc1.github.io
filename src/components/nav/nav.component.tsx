import React, { useEffect } from "react";
import { Text } from "../../components/text/text.component";
import "./nav.style.scss";
import { theme } from "../../colors.js";

export const Nav = () => {
  const clickProjects = () => {
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
  };
  const clickAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };
  const clickPhotography = () => {
    document
      .getElementById("photography")
      ?.scrollIntoView({ behavior: "smooth" });
  };
  const clickContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="display-nav">
      <Text
        marginLeft={24}
        size="Display"
        color={theme.primary}
        text="Jason Chen"
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
