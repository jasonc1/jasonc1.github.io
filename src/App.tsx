import React, { useEffect, useState } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { Main } from "./pages/Main/Main";
import NotFound from "./pages/NotFound/NotFound.component";
import { Nav } from "./components/nav/nav.component";
import { Footer } from "./components/footer/footer.component";
import theme from "./colors";
import { Text } from "./components/text/text.component";

const navItems = ["Work", "About", "Photography", "Contact"];

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
    customScrollTo("Work", true);
  };
  const mobileScrollAbout = () => {
    setShowMenu(false);
    customScrollTo("About", true);
  };
  const mobileScrollPhoto = () => {
    setShowMenu(false);
    customScrollTo("Photography", true);
  };
  const mobileScrollContact = () => {
    setShowMenu(false);
    customScrollTo("Contact", true);
  };

  const MobileMenu = (
    <div className="mobile-menu">
      <ul role="menu" className="menu-content">
        <li className="first" onClick={mobileScrollProjects}>
          <Text size="Header" color={theme.primary} text="Work" />
        </li>
        <li onClick={mobileScrollPhoto}>
          <Text size="Header" color={theme.primary} text="Photo" />
        </li>
        <li onClick={mobileScrollAbout}>
          <Text size="Header" color={theme.primary} text="About" />
        </li>
        <li onClick={mobileScrollContact}>
          <Text size="Header" color={theme.primary} text="Contact" />
        </li>
        <li className="last">
          <Text size="Header" text="&copy; JASON CHEN 2024" />
        </li>
      </ul>
    </div>
  );

  useEffect(() => {
    const workElement = document.getElementById("Work")!;
    const aboutElement = document.getElementById("About")!;
    const photographyElement = document.getElementById("Photography")!;
    const contactElement = document.getElementById("Contact")!;
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
    <BrowserRouter>
      <Nav
        customScrollTo={customScrollTo}
        screenWidth={screenWidth}
        setShowMenu={setShowMenu}
        showMenu={showMenu}
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
        <Route path="/404" render={NotFound} />

        <Redirect from="*" to="/404" />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
