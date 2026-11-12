import { useEffect, useState } from "react";
import copy from "./data/copy.json";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import CitationDialog from "./components/CitationDialog";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Publications from "./pages/Publications";
import About from "./pages/About";
import useNavigation from "./hooks/useNavigation";

export default function App({ initialTab = "home" }) {
  const { activeTab, navigate, pulseId, hydrated } = useNavigation(initialTab);
  const [citation, setCitation] = useState(null);
  useEffect(() => {
    const tab = copy.tabs.find((item) => item.id === activeTab);
    if (tab) document.title = tab.title;
  }, [activeTab]);
  const pages = {
    home: (
      <Home
        active={activeTab === "home"}
        pulseId={pulseId}
        onCitation={setCitation}
      />
    ),
    projects: <Projects active={activeTab === "projects"} />,
    publications: (
      <Publications
        activeTab={activeTab}
        onCitation={setCitation}
        pulseId={pulseId}
      />
    ),
    about: <About active={activeTab === "about"} />,
  };
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar activeTab={activeTab} navigate={navigate} />
      <div className="layout">
        <main className="main" id="main-content" tabIndex={-1}>
          {copy.tabs.map((tab) => (
            <section
              key={tab.id}
              className="panel"
              id={tab.id}
              role="tabpanel"
              aria-labelledby={`tab-${tab.id}`}
              tabIndex={0}
              hidden={activeTab !== tab.id}
            >
              {/* Each prerendered page carries only its own tab; the rest mount on load. */}
              {(hydrated || tab.id === initialTab) && pages[tab.id]}
            </section>
          ))}
          <Footer activeTab={activeTab} />
        </main>
        <Sidebar />
      </div>
      <CitationDialog
        publication={citation}
        onClose={() => setCitation(null)}
      />
    </>
  );
}
