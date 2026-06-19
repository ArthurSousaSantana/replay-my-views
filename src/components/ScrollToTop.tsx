import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Scroll management:
 * - PUSH/REPLACE: scroll to top.
 * - POP (back/forward): restore the exact saved position for that history entry.
 *
 * We save scroll position per history key (location.key) in sessionStorage and
 * re-apply it on POP. Because content may still be loading/lazy-rendering when
 * we navigate back, we keep re-applying the saved offset for a short window
 * until the document is tall enough or the user scrolls.
 */

const STORAGE_KEY = "scrollPositions";

type PositionMap = Record<string, number>;

const readPositions = (): PositionMap => {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

const writePositions = (map: PositionMap) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
};

const ScrollToTop = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const prevKeyRef = useRef<string>(location.key);

  // Disable the browser's own scroll restoration so it doesn't fight ours.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      const prev = window.history.scrollRestoration;
      window.history.scrollRestoration = "manual";
      return () => {
        window.history.scrollRestoration = prev;
      };
    }
  }, []);

  // Save the scroll position of the page we are leaving (keyed by its history key).
  useEffect(() => {
    const keyAtMount = location.key;
    const handleSave = () => {
      const map = readPositions();
      map[keyAtMount] = window.scrollY;
      writePositions(map);
    };

    window.addEventListener("pagehide", handleSave);
    prevKeyRef.current = keyAtMount;
    return () => {
      handleSave();
      window.removeEventListener("pagehide", handleSave);
    };
  }, [location.key]);

  // Apply scroll on navigation.
  useLayoutEffect(() => {
    if (navigationType === "POP") {
      const map = readPositions();
      const target = map[location.key] ?? 0;

      // Try to restore immediately, then retry while content loads.
      let cancelled = false;
      let userScrolled = false;
      const onUserScroll = () => {
        userScrolled = true;
      };
      window.addEventListener("wheel", onUserScroll, { passive: true, once: true });
      window.addEventListener("touchmove", onUserScroll, { passive: true, once: true });

      const start = performance.now();
      const tryRestore = () => {
        if (cancelled || userScrolled) return;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const desired = Math.min(target, Math.max(0, maxScroll));
        window.scrollTo(0, desired);
        // Keep retrying for up to 1.2s in case images/queries expand the page.
        if (Math.abs(window.scrollY - target) > 2 && performance.now() - start < 1200) {
          requestAnimationFrame(tryRestore);
        }
      };
      requestAnimationFrame(tryRestore);

      return () => {
        cancelled = true;
        window.removeEventListener("wheel", onUserScroll);
        window.removeEventListener("touchmove", onUserScroll);
      };
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.key, navigationType]);

  return null;
};

export default ScrollToTop;
