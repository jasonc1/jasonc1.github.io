import React, { useRef, useEffect, useState } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
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
import Rosetta from "./pages/Projects/Rosetta";
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
          <Text size="Header" color={theme.primary} text={navItems[0]} caps />
        </li>
        <li onClick={mobileScrollPhoto}>
          <Text size="Header" color={theme.primary} text={navItems[1]} caps />
        </li>
        <li onClick={mobileScrollAbout}>
          <Text size="Header" color={theme.primary} text={navItems[2]} caps />
        </li>
        <li onClick={mobileScrollContact}>
          <Text size="Header" color={theme.primary} text={navItems[3]} caps />
        </li>
        <li className="last">
          <Text size="Header" text="&copy; JASON CHEN 2024" textAlign="left" caps />
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
      <Routes>
        <Route
          path="/"
          element={
            <Main
              screenWidth={screenWidth}
              navDisplay={navDisplay}
              navItems={navItems}
            />
          }
        />
        <Route path="/brag" element={<UnderConstruction />} />
        <Route path="/rosetta" element={<Rosetta />} />
        <Route path="/noho" element={<UnderConstruction />} />
        <Route path="/bluebook" element={<Bluebook />} />
        <Route path="/ink" element={<Ink />} />
        <Route path="/vesta" element={<Vesta />} />
        <Route path="/alchemy" element={<Alchemy />} />
        <Route path="/ids" element={<IDSAccordion />} />
        <Route path="/404" element={<NotFound />} />

        <Route path="/abstract-migrate" element={<AbstractMigrate />} />
        <Route path="/carta-exercise-status" element={<ExerciseStatus />} />
        <Route path="/carta-employee-onboarding" element={<EmployeeOnboarding />} />
        <Route path="/haven" element={<Haven />} />
        <Route path="/sapling" element={<Sapling />} />
        <Route path="/wait-task-v2" element={<WaitTaskV2 />} />
        <Route path="/otm" element={<OTM />} />
        <Route path="/doc-uploader" element={<DocUploader />} />
        <Route path="/SR-legacy" element={<SRLegacy />} />
        <Route path="/SR" element={<StratRoulette />} />
        <Route path="/product-illustrations" element={<ProductIllustrations />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <Footer />
    </HashRouter>
  );
};

export default App;
