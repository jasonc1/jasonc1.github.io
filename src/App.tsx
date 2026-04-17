import React, { useEffect, useRef, useState } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Main } from "./pages/Main/Main";
import { AsciiGallery } from "./pages/AsciiGallery/AsciiGallery";
import NotFound from "./pages/NotFound/NotFound.component";
import { FloatingNav } from "./components/FloatingNav/FloatingNav";
import { Footer } from "./components/footer/footer.component";
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
import { ProjectBar } from "./components/ProjectBar/ProjectBar";
import DocUploader from "./pages/Projects/old/DocUploader";
import SRLegacy from "./pages/Projects/old/SRLegacy";
import StratRoulette from "./pages/Projects/old/StratRoulette";
import ProductIllustrations from "./pages/Projects/old/ProductIllustrations";
import Rosetta from "./pages/Projects/Rosetta";

const navItems = ["Work", "Photo", "About", "Contact"];

// Inner app — has access to router context
const AppContent = () => {
  const { pathname } = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [navDisplay, setNavDisplay] = useState(navItems[0]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Close mobile menu on route change
  useEffect(() => {
    setShowMenu(false);
  }, [pathname]);

  // Enable scroll-snap only on the home/gallery route.
  // On the home route, snap is activated by AsciiGallery after scroll restoration
  // to avoid yanking the user back to the top on reload/back-nav.
  // For non-home routes, remove snap immediately.
  useEffect(() => {
    if (pathname !== '/') {
      document.documentElement.classList.remove('snap-enabled');
    }
    return () => {
      document.documentElement.classList.remove('snap-enabled');
    };
  }, [pathname]);

  // Track which portfolio section is in view (for Main sidebar)
  useEffect(() => {
    const elementInViewport = (element: HTMLElement | null) => {
      if (!element) return;
      const bBox = element.getBoundingClientRect();
      const elementCenter = bBox.top + bBox.height / 2;
      const windowCenter = window.innerHeight;
      if (elementCenter < windowCenter && elementCenter >= 0) {
        setNavDisplay(element.id || "null");
      }
    };

    const workEl = document.getElementById(navItems[0]);
    if (!workEl) return; // Not on a page that has portfolio sections

    const photoEl = document.getElementById(navItems[1]);
    const aboutEl = document.getElementById(navItems[2]);
    const contactEl = document.getElementById(navItems[3]);

    const handleScroll = () => {
      elementInViewport(workEl);
      elementInViewport(photoEl);
      elementInViewport(aboutEl);
      elementInViewport(contactEl);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <ScrollTop />
      {pathname !== '/' && <ProjectBar />}
      <FloatingNav
        screenWidth={screenWidth}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        navDisplay={navDisplay}
      />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <AsciiGallery />
              <div className="portfolio-section" id="portfolio">
                <Main
                  screenWidth={screenWidth}
                  navDisplay={navDisplay}
                  navItems={navItems}
                />
                <Footer />
              </div>
            </>
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
    </>
  );
};

export const App = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);

export default App;
