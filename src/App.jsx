import { useEffect, useState } from "react";
import profile from "./data/profile.json";
import copy from "./data/copy.json";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import CitationDialog from "./components/CitationDialog";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Publications from "./pages/Publications";
import About from "./pages/About";
import useHashNavigation from "./hooks/useHashNavigation";

export default function App() {
  const { activeTab, navigate, route, pulseId } = useHashNavigation();
  const [citation, setCitation] = useState(null);
  useEffect(() => {
    document.title = `${profile.name === "Your Name" ? "Research Portfolio" : profile.name} · Human-Centered AI`;
  }, []);
  const pages = {
    home: <Home pulseId={pulseId} onCitation={setCitation} />,
    projects: <Projects />,
    publications: (
      <Publications
        activeTab={activeTab}
        onCitation={setCitation}
        pulseId={pulseId}
      />
    ),
    about: <About />,
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
              {pages[tab.id]}
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
