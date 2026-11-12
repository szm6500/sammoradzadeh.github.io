import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { tabFromPath, tabIds, tabPath } from "../utils/routes";

export const scrollBehavior = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "instant"
    : "smooth";

function decodeHash(hash) {
  try {
    return decodeURIComponent(hash.replace(/^#/, ""));
  } catch {
    return "";
  }
}

function panelForId(id, fallback) {
  if (id.startsWith("full-paper-")) return "publications";
  return document.getElementById(id)?.closest(".panel")?.id || fallback;
}

function readRoute(version) {
  const hash = decodeHash(window.location.hash);
  // Old links used #publications etc. for tabs.
  if (tabIds.includes(hash)) {
    window.history.replaceState(
      null,
      "",
      `${tabPath(hash)}${window.location.search}`,
    );
    return { tab: hash, hash: "", version };
  }
  return {
    tab: tabFromPath(window.location.pathname) ?? "home",
    hash,
    version,
  };
}

/**
 * Tabs live at real paths (/projects/ …) so each one is its own page;
 * in-page anchors stay as hashes.
 */
export default function useNavigation(initialTab = "home") {
  const [route, setRoute] = useState({ tab: initialTab, hash: "", version: 0 });
  const [activeTab, setActiveTab] = useState(initialTab);
  const [pulseId, setPulseId] = useState(null);
  // False for the prerendered markup and the first client render.
  const [hydrated, setHydrated] = useState(false);

  const navigate = useCallback((href) => {
    const url = new URL(href, window.location.href);
    const destination = `${url.pathname}${url.search}${url.hash}`;
    if (
      `${window.location.pathname}${window.location.search}${window.location.hash}` !==
      destination
    )
      window.history.pushState(null, "", destination);
    setRoute((current) => readRoute(current.version + 1));
  }, []);

  useLayoutEffect(() => {
    setRoute(readRoute(0));
    setHydrated(true);
  }, []);

  useEffect(() => {
    const sync = () => setRoute((current) => readRoute(current.version + 1));
    function onClick(event) {
      const link = event.target.closest("a");
      if (!link) return;
      if (link.getAttribute("aria-disabled") === "true") {
        event.preventDefault();
        return;
      }
      const href = link.getAttribute("href");
      if (
        !href ||
        href === "#" ||
        link.target === "_blank" ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      )
        return;
      const url = new URL(link.href);
      if (url.origin !== window.location.origin) return;
      if (!href.startsWith("#") && tabFromPath(url.pathname) === null) return;
      event.preventDefault();
      navigate(href);
    }
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
      document.removeEventListener("click", onClick);
    };
  }, [navigate]);

  useLayoutEffect(() => {
    if (!route.hash || route.hash === "main-content") {
      setActiveTab(route.tab);
      return;
    }
    const panel = panelForId(route.hash, route.tab);
    if (panel !== route.tab)
      window.history.replaceState(
        null,
        "",
        `${tabPath(panel)}${window.location.search}${window.location.hash}`,
      );
    setActiveTab(panel);
  }, [route]);

  useEffect(() => {
    const id = route.hash;
    if (!id) {
      setPulseId(null);
      if (route.version > 0)
        window.scrollTo({ top: 0, behavior: scrollBehavior() });
      return;
    }
    const target = document.getElementById(id);
    if (!target || target.closest(".panel")?.hidden) return;
    let timeout;
    const frame = requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
      target.focus({ preventScroll: true });
      if (
        target.classList.contains("research-card") ||
        target.classList.contains("publication-card")
      ) {
        setPulseId(id);
        timeout = setTimeout(() => setPulseId(null), 2900);
      }
    });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
      setPulseId(null);
    };
  }, [route, activeTab]);

  return { activeTab, navigate, route, pulseId, hydrated };
}
