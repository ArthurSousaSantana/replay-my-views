import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * SPA scroll restoration.
 *
 * Instead of saving only during route unmount, this persists the current route
 * while the user scrolls. Back/forward navigation can then restore the real last
 * position even if async content or images change the page height after mount.
 */

const STORAGE_KEY = "dg-scroll-restoration-v2";
const MAX_RESTORE_DURATION = 1800;
const MAX_SAVED_ENTRIES = 80;

type ScrollPosition = {
  x: number;
  y: number;
  updatedAt: number;
};

type ScrollStore = {
  byHistoryKey: Record<string, ScrollPosition>;
  byPath: Record<string, ScrollPosition>;
};

type RouteSnapshot = {
  historyKey: string;
  pathKey: string;
};

const emptyStore = (): ScrollStore => ({
  byHistoryKey: {},
  byPath: {},
});

const readStore = (): ScrollStore => {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
    return {
      byHistoryKey: parsed.byHistoryKey || {},
      byPath: parsed.byPath || {},
    };
  } catch {
    return emptyStore();
  }
};

const prunePositions = (positions: Record<string, ScrollPosition>) => {
  const entries = Object.entries(positions);
  if (entries.length <= MAX_SAVED_ENTRIES) return positions;

  return Object.fromEntries(
    entries
      .sort(([, a], [, b]) => b.updatedAt - a.updatedAt)
      .slice(0, MAX_SAVED_ENTRIES),
  );
};

const writeStore = (store: ScrollStore) => {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        byHistoryKey: prunePositions(store.byHistoryKey),
        byPath: prunePositions(store.byPath),
      }),
    );
  } catch {
    /* ignore */
  }
};

const getDocumentMaxScroll = () =>
  Math.max(
    0,
    Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) -
      window.innerHeight,
  );

const getSavedPosition = ({ historyKey, pathKey }: RouteSnapshot) => {
  const store = readStore();
  return store.byHistoryKey[historyKey] || store.byPath[pathKey] || null;
};

const savePosition = ({ historyKey, pathKey }: RouteSnapshot) => {
  const store = readStore();
  const position: ScrollPosition = {
    x: window.scrollX,
    y: window.scrollY,
    updatedAt: Date.now(),
  };

  store.byHistoryKey[historyKey] = position;
  store.byPath[pathKey] = position;
  writeStore(store);
};

const ScrollToTop = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const routeSnapshot = useMemo<RouteSnapshot>(
    () => ({
      historyKey: location.key,
      pathKey: `${location.pathname}${location.search}${location.hash}`,
    }),
    [location.hash, location.key, location.pathname, location.search],
  );
  const activeRouteRef = useRef<RouteSnapshot>(routeSnapshot);
  const scrollFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      const previousRestoration = window.history.scrollRestoration;
      window.history.scrollRestoration = "manual";

      return () => {
        window.history.scrollRestoration = previousRestoration;
      };
    }
  }, []);

  useEffect(() => {
    const scheduleSave = () => {
      if (scrollFrameRef.current !== null) return;

      scrollFrameRef.current = window.requestAnimationFrame(() => {
        scrollFrameRef.current = null;
        savePosition(activeRouteRef.current);
      });
    };

    const saveNow = () => savePosition(activeRouteRef.current);

    window.addEventListener("scroll", scheduleSave, { passive: true });
    window.addEventListener("pagehide", saveNow);
    window.addEventListener("beforeunload", saveNow);
    document.addEventListener("visibilitychange", saveNow);

    return () => {
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
        scrollFrameRef.current = null;
      }
      saveNow();
      window.removeEventListener("scroll", scheduleSave);
      window.removeEventListener("pagehide", saveNow);
      window.removeEventListener("beforeunload", saveNow);
      document.removeEventListener("visibilitychange", saveNow);
    };
  }, []);

  useLayoutEffect(() => {
    const previousRoute = activeRouteRef.current;
    savePosition(previousRoute);
    activeRouteRef.current = routeSnapshot;

    if (navigationType === "POP") {
      const target = getSavedPosition(routeSnapshot) || { x: 0, y: 0 };
      let cancelled = false;
      let userScrolled = false;
      let frameId: number | null = null;
      let timeoutId: number | null = null;
      let resizeObserver: ResizeObserver | null = null;

      const onUserScroll = () => {
        userScrolled = true;
      };

      window.addEventListener("wheel", onUserScroll, { passive: true, once: true });
      window.addEventListener("touchmove", onUserScroll, { passive: true, once: true });
      window.addEventListener("keydown", onUserScroll, { once: true });

      const start = performance.now();
      const restore = () => {
        if (cancelled || userScrolled) return;

        const y = Math.min(target.y, getDocumentMaxScroll());
        window.scrollTo(target.x, y);

        const needsRetry =
          Math.abs(window.scrollX - target.x) > 2 ||
          Math.abs(window.scrollY - target.y) > 2;

        if (needsRetry && performance.now() - start < MAX_RESTORE_DURATION) {
          frameId = window.requestAnimationFrame(restore);
        }
      };

      frameId = window.requestAnimationFrame(restore);
      timeoutId = window.setTimeout(() => {
        cancelled = true;
      }, MAX_RESTORE_DURATION);

      if ("ResizeObserver" in window) {
        resizeObserver = new ResizeObserver(() => restore());
        resizeObserver.observe(document.documentElement);
        if (document.body) resizeObserver.observe(document.body);
      }

      return () => {
        cancelled = true;
        savePosition(routeSnapshot);
        if (frameId !== null) window.cancelAnimationFrame(frameId);
        if (timeoutId !== null) window.clearTimeout(timeoutId);
        resizeObserver?.disconnect();
        window.removeEventListener("wheel", onUserScroll);
        window.removeEventListener("touchmove", onUserScroll);
        window.removeEventListener("keydown", onUserScroll);
      };
    }

    window.scrollTo(0, 0);

    return () => {
      savePosition(routeSnapshot);
    };
  }, [navigationType, routeSnapshot]);

  return null;
};

export default ScrollToTop;
