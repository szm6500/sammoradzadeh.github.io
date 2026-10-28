import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import copy from "../data/copy.json";

const tabs = copy.tabs.map((tab) => tab.id);
export const scrollBehavior = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "instant"
    : "smooth";
function decodeHash(hash) {
  try {
    return decodeURIComponent(hash.replace(/^#/, ""));
  } catch {
    return "home";
  }
}
function panelForHash(hash) {
  const id = decodeHash(hash);
  if (tabs.includes(id)) return id;
  if (id.startsWith("full-paper-")) return "publications";
  return document.getElementById(id)?.closest(".panel")?.id || "home";
}

/** Hash routes work on GitHub Pages without server-side rewrite rules. */
export default function useHashNavigation() {
  const [route, setRoute] = useState(() => ({
    hash: window.location.hash || "#home",
    version: 0,
  }));
  const [activeTab, setActiveTab] = useState(() =>
    panelForHash(window.location.hash),
  );
  const [pulseId, setPulseId] = useState(null);
  const navigate = useCallback((hash) => {
    const isTopLevelTab = tabs.includes(hash.replace(/^#/, ""));
    const destination = isTopLevelTab
      ? `${window.location.pathname}${hash}`
      : hash;
    if (
      `${window.location.pathname}${window.location.search}${window.location.hash}` !==
      destination
    )
      window.history.pushState(null, "", destination);
    setRoute((current) => ({ hash, version: current.version + 1 }));
  }, []);

  useEffect(() => {
    const onHashChange = () =>
      setRoute((current) => ({
        hash: window.location.hash || "#home",
        version: current.version + 1,
      }));
    function onClick(event) {
      const link = event.target.closest("a");
      if (!link) return;
      if (link.getAttribute("aria-disabled") === "true") {
        event.preventDefault();
        return;
      }
      const href = link.getAttribute("href");
      if (
        !href?.startsWith("#") ||
        href === "#" ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      )
        return;
      event.preventDefault();
      navigate(href);
    }
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onClick);
    };
  }, [navigate]);

  useLayoutEffect(() => {
    if (route.hash !== "#main-content") setActiveTab(panelForHash(route.hash));
  }, [route]);

  useEffect(() => {
    const id = decodeHash(route.hash);
    if (!id || tabs.includes(id)) {
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

  return { activeTab, navigate, route, pulseId };
}
