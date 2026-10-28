import { useState } from "react";
import profile from "../data/profile.json";
import copy from "../data/copy.json";
import BrandMark from "./BrandMark";
import Icon from "./Icon";

export default function Navbar({ activeTab, navigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  function onKeyDown(event) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const index = copy.tabs.findIndex((tab) => tab.id === activeTab);
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? copy.tabs.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + copy.tabs.length) %
            copy.tabs.length;
    const id = copy.tabs[next].id;
    navigate(`#${id}`);
    document.getElementById(`tab-${id}`)?.focus();
  }
  return (
    <header className="topbar">
      <div className="nav-inner">
        <a className="brand" href="#home" aria-label="Research portfolio home">
          <span className="brand-mark" aria-hidden="true">
            <BrandMark />
          </span>
          <span className="brand-name">{profile.name}</span>
          <span className="brand-tag">{profile.title}</span>
        </a>
        <button
          className="nav-menu-toggle"
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? "x" : "menu"} />
        </button>
        <div className={`nav-right ${menuOpen ? "is-open" : ""}`}>
          <nav
            id="primary-navigation"
            className="nav-tabs"
            role="tablist"
            aria-label="Portfolio sections"
            onKeyDown={onKeyDown}
          >
            {copy.tabs.map((tab) => (
              <a
                className="nav-tab"
                key={tab.id}
                id={`tab-${tab.id}`}
                href={`#${tab.id}`}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={tab.id}
                tabIndex={activeTab === tab.id ? 0 : -1}
                onClick={() => setMenuOpen(false)}
              >
                {tab.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
