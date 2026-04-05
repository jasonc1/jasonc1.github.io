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
          <Text size="Header" text="Back" color={theme.primary} weight="medium" />
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
        caps
        weight="medium"
      />
    </li>
  );
  const homeMenu = (
    <>
      <li id="nav-projects" onClick={clickProjects}>
        <Text size="Header" text={navItems[0]} caps />
      </li>
      <li id="nav-photography" onClick={clickPhotography}>
        <Text size="Header" text={navItems[1]} caps />
      </li>
      <li id="nav-about" onClick={clickAbout}>
        <Text size="Header" text={navItems[2]} caps />
      </li>
      <li id="nav-contact" onClick={clickContact}>
        <Text size="Header" text={navItems[3]} caps />
      </li>
    </>
  );

  const navMenu = <ul className="nav-menu">{isHome ? homeMenu : back}</ul>;

  const mobileMenu = <ul className="nav-menu">{isHome ? mobile : back}</ul>;

  return (
    <nav className="display-nav">
      <Link to="/">
        <div
          id="display-name-gradient"
          data-text="Jason Chen"
          onMouseEnter={(e) => {
            const el = e.currentTarget;

            // 1. Strip class so the animation truly restarts
            el.classList.remove("glitching");
            // Force reflow — browser must flush the removal before we re-add
            void (el as HTMLElement).offsetWidth;

            const r = () => Math.random();

            // Easing: snappy ease-out territory; y1 > 1 gives occasional overshoot
            const ease = `cubic-bezier(${(r()*0.25+0.10).toFixed(3)}, ${(r()*0.5+0.8).toFixed(3)}, ${(r()*0.25+0.25).toFixed(3)}, ${(r()*0.15+0.9).toFixed(3)})`;
            const dur   = `${(r()*0.3+0.38).toFixed(3)}s`;   // 0.38–0.68s
            const delay = `${(r()*0.07+0.01).toFixed(3)}s`;  // 0.01–0.08s

            // glitch-main: skew + translate amounts
            el.style.setProperty("--gm-sk1", `${-(r()*6+2).toFixed(1)}deg`);   // -2 to -8
            el.style.setProperty("--gm-tx1", `${-(r()*4+1).toFixed(1)}px`);
            el.style.setProperty("--gm-sk2", `${(r()*5+1).toFixed(1)}deg`);    //  1 to  6
            el.style.setProperty("--gm-tx2", `${(r()*3).toFixed(1)}px`);
            el.style.setProperty("--gm-tx3", `${-(r()*2).toFixed(1)}px`);

            // glitch-top: translate amounts per keyframe step
            el.style.setProperty("--gt-x1", `${-(r()*12+4).toFixed(1)}px`);    // -4 to -16
            el.style.setProperty("--gt-x2", `${(r()*8+2).toFixed(1)}px`);      //  2 to 10
            el.style.setProperty("--gt-x3", `${-(r()*5).toFixed(1)}px`);       //  0 to -5

            // glitch-bottom: opposite polarity so the two halves diverge
            el.style.setProperty("--gb-x1", `${(r()*12+5).toFixed(1)}px`);     //  5 to 17
            el.style.setProperty("--gb-x2", `${-(r()*8+2).toFixed(1)}px`);     // -2 to -10
            el.style.setProperty("--gb-x3", `${(r()*4).toFixed(1)}px`);        //  0 to  4

            el.style.setProperty("--glitch-ease",  ease);
            el.style.setProperty("--glitch-dur",   dur);
            el.style.setProperty("--glitch-delay", delay);

            // 2. Re-add class — animation fires with fresh values
            el.classList.add("glitching");
          }}
        >
          <Text
            marginLeft={24}
            size="Display"
            color={theme.primary}
            text="Jason Chen"
          />
        </div>
      </Link>

      <div className="center-detail">
        <Text size="Header" text="DESIGN ENGINEER / SF" />
      </div>

      {screenWidth >= 1200 ? navMenu : mobileMenu}
    </nav>
  );
};
