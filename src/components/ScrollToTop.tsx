import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Scroll to top on new navigations (PUSH/REPLACE).
 * On POP (browser/mobile back button) the browser restores
 * the previous scroll position automatically.
 */
const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [pathname, search, navigationType]);

  return null;
};

export default ScrollToTop;
