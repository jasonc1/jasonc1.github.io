import React, { useEffect, useState } from "react";
import { Text } from "../../components/text/text.component";
import "./nav.style.scss";
import { theme } from "../../colors.js";
import { INavProps } from "./nav.model";
import { Link } from "react-router-dom";

export const Nav = ({
  screenWidth,
  setShowMenu,
  showMenu,
  customScrollTo,
}: INavProps) => {
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

  const navMenu = (
    <ul className="nav-menu">
      <li id="nav-projects" onClick={clickProjects}>
        {/* this was just to test routing aka see if we could get to 404 
        <Link to="/aaaaa">
          <Text size="Header" color={theme.primary} text="Work" />
        </Link> */}

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
  );

  const mobileMenu = (
    <ul className="nav-menu">
      <li onClick={() => setShowMenu(!showMenu)}>
        <Text
          size="Header"
          color={theme.primary}
          text={showMenu ? "Close" : "Menu"}
        />
      </li>
    </ul>
  );

  return (
    <nav className="display-nav">
      <Link to="/">
        <Text
          marginLeft={24}
          size="Display"
          color={theme.primary}
          text="Jason Chen"
          id="display-name-gradient"
        />
      </Link>

      <div className="center-detail">
        <Text size="Header" color={theme.primary} text="Design Systems / SF" />
      </div>

      {screenWidth >= 1200 ? navMenu : mobileMenu}
    </nav>
  );
};
