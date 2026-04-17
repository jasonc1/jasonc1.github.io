import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    // Only scroll to top on forward navigation (PUSH / REPLACE).
    // Skip on:
    //  - initial mount (reload — prevPath === pathname)
    //  - POP (back / forward) so scroll position can be restored
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      if (navType !== "POP") {
        window.scrollTo(0, 0);
      }
    }
  }, [pathname, navType]);

  return null;
}
