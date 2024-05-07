import { Text } from "../../components/text/text.component";
import "./nav.style.scss";
import { theme } from "../../colors.js";
import { INavProps } from "./nav.model";
import { Link, useLocation } from "react-router-dom";

export const Nav = ({
  screenWidth,
  setShowMenu,
  showMenu,
  customScrollTo,
  navItems,
}: INavProps) => {
  const clickProjects = () => {
    customScrollTo(navItems[0]);
  };
  const clickPhotography = () => {
    customScrollTo(navItems[1]);
  };
  const clickAbout = () => {
    customScrollTo(navItems[2]);
  };
  const clickContact = () => {
    customScrollTo(navItems[3]);
  };
  let location = useLocation();

  const isHome = location.pathname === "/";
  const back = (
    <>
      <Link to="/">
        <li id="nav-projects">
          <Text size="Header" text="Back" color={theme.primary} />
        </li>
      </Link>
    </>
  );

  const mobile = (
    <li onClick={() => setShowMenu(!showMenu)}>
      <Text
        size="Header"
        color={theme.primary}
        text={showMenu ? "Close" : "Menu"}
      />
    </li>
  );
  const homeMenu = (
    <>
      <li id="nav-projects" onClick={clickProjects}>
        <Text size="Header" text={navItems[0]} />
      </li>
      <li id="nav-photography" onClick={clickPhotography}>
        <Text size="Header" text={navItems[1]} />
      </li>
      <li id="nav-about" onClick={clickAbout}>
        <Text size="Header" text={navItems[2]} />
      </li>
      <li id="nav-contact" onClick={clickContact}>
        <Text size="Header" text={navItems[3]} />
      </li>
    </>
  );

  const navMenu = <ul className="nav-menu">{isHome ? homeMenu : back}</ul>;

  const mobileMenu = <ul className="nav-menu">{isHome ? mobile : back}</ul>;

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
