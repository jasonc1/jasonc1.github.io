import React, { useEffect, useState } from "react";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import { Main } from "./pages/Main/Main";
import NotFound from "./pages/NotFound/NotFound.component";
import { Nav } from "./components/nav/nav.component";
import { Footer } from "./components/footer/footer.component";
import theme from "./colors";
import { Text } from "./components/text/text.component";
import Bluebook from "./pages/Projects/Bluebook";
import Ink from "./pages/Projects/Ink";
import Vesta from "./pages/Projects/Vesta";
import Alchemy from "./pages/Projects/Alchemy";
import IDSAccordion from "./pages/Projects/IDSAccordion";
import UnderConstruction from "./pages/NotFound/UnderConstruction.component";
import AbstractMigrate from "./pages/Projects/AbstractMigrate";
import ExerciseStatus from "./pages/Projects/ExerciseStatus";
import EmployeeOnboarding from "./pages/Projects/EmployeeOnboarding";
import Haven from "./pages/Projects/Haven";
import Sapling from "./pages/Projects/Sapling";
import WaitTaskV2 from "./pages/Projects/WaitTaskV2";
import OTM from "./pages/Projects/OTM";
import ScrollTop from "./components/ScrollTop/ScrollTop";
import DocUploader from "./pages/Projects/old/DocUploader";
import SRLegacy from "./pages/Projects/old/SRLegacy";
import StratRoulette from "./pages/Projects/old/StratRoulette";
import ProductIllustrations from "./pages/Projects/old/ProductIllustrations";
const navItems = ["Work", "Photo", "About", "Contact"];

export const App = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [navDisplay, setNavDisplay] = useState(navItems[0]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const elementInViewport = (element: HTMLElement, isMobile?: boolean) => {
    const bBox = element.getBoundingClientRect();
    const yOffset = isMobile ? 0 : -128;
    // this gets the vertical center coordinate of your element
    const elementCenter = bBox.top + yOffset + bBox.height / 2;
    const windowCenter = window.innerHeight;

    // console.log(windowCenter);
    if (elementCenter < windowCenter && elementCenter >= 0) {
      // console.log("element: " + elementCenter);
      // console.log(element.id + ": IN VIEWPORT");
      setNavDisplay(element.id ? element.id : "null");
    }
  };

  const customScrollTo = (id: string, isMobile?: boolean) => {
    const element = document.getElementById(id);
    const yOffset = isMobile ? -128 : -72;
    if (element) {
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      elementInViewport(element, isMobile);
    }
  };

  const mobileScrollProjects = () => {
    setShowMenu(false);
    customScrollTo(navItems[0], true);
  };
  const mobileScrollPhoto = () => {
    setShowMenu(false);
    customScrollTo(navItems[1], true);
  };
  const mobileScrollAbout = () => {
    setShowMenu(false);
    customScrollTo(navItems[2], true);
  };
  const mobileScrollContact = () => {
    setShowMenu(false);
    customScrollTo(navItems[3], true);
  };

  const MobileMenu = (
    <div className="mobile-menu">
      <ul role="menu" className="menu-content">
        <li className="first" onClick={mobileScrollProjects}>
          <Text size="Header" color={theme.primary} text={navItems[0]} />
        </li>
        <li onClick={mobileScrollPhoto}>
          <Text size="Header" color={theme.primary} text={navItems[1]} />
        </li>
        <li onClick={mobileScrollAbout}>
          <Text size="Header" color={theme.primary} text={navItems[2]} />
        </li>
        <li onClick={mobileScrollContact}>
          <Text size="Header" color={theme.primary} text={navItems[3]} />
        </li>
        <li className="last">
          <Text size="Header" text="&copy; JASON CHEN 2024" />
        </li>
      </ul>
    </div>
  );

  useEffect(() => {
    const workElement = document.getElementById(navItems[0])!;
    const photographyElement = document.getElementById(navItems[1])!;
    const aboutElement = document.getElementById(navItems[2])!;
    const contactElement = document.getElementById(navItems[3])!;
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

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <HashRouter>
      <ScrollTop />
      <Nav
        customScrollTo={customScrollTo}
        screenWidth={screenWidth}
        setShowMenu={setShowMenu}
        showMenu={showMenu}
        navItems={navItems}
      />
      {showMenu ? MobileMenu : null}
      <Switch>
        <Route
          exact
          path="/"
          render={(props) => (
            <Main
              screenWidth={screenWidth}
              navDisplay={navDisplay}
              navItems={navItems}
            />
          )}
        />
        <Route path="/brag" render={UnderConstruction} />
        <Route path="/rosetta" render={UnderConstruction} />
        <Route path="/bluebook" render={Bluebook} />
        <Route path="/ink" render={Ink} />
        <Route path="/vesta" render={Vesta} />
        <Route path="/alchemy" render={Alchemy} />
        <Route path="/ids" render={IDSAccordion} />
        <Route path="/404" render={NotFound} />

        <Route path="/abstract-migrate" render={AbstractMigrate} />
        <Route path="/carta-exercise-status" render={ExerciseStatus} />
        <Route path="/carta-employee-onboarding" render={EmployeeOnboarding} />
        <Route path="/haven" render={Haven} />
        <Route path="/sapling" render={Sapling} />
        <Route path="/wait-task-v2" render={WaitTaskV2} />
        <Route path="/otm" render={OTM} />

        <Route path="/doc-uploader" render={DocUploader} />
        <Route path="/SR-legacy" render={SRLegacy} />
        <Route path="/SR" render={StratRoulette} />
        <Route path="/product-illustrations" render={ProductIllustrations} />

        <Redirect from="*" to="/404" />
      </Switch>
      <Footer />
    </HashRouter>
  );
};

export default App;
