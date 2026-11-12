import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import CitationDialog from "../components/CitationDialog";
import Icon from "../components/Icon";
import { AuthorList } from "../components/PublicationList";
import { resourceUrl } from "../utils/urls";
import { tabPath } from "../utils/routes";

export default function Paper({ publication }) {
  const [citation, setCitation] = useState(null);
  const pdf = resourceUrl(publication.pdf);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar
        activeTab="publications"
        navigate={(href) => window.location.assign(href)}
        standalone
      />
      <div className="layout">
        <main className="main" id="main-content" tabIndex={-1}>
          <article className="paper-page">
            <a className="paper-back" href={tabPath("publications")}>
              All publications
            </a>
            <p className="paper-venue">
              {publication.venue} · {publication.year} · {publication.type}
            </p>
            <h1 className="paper-title">{publication.title}</h1>
            <p className="paper-authors">
              <AuthorList authors={publication.authors} />
            </p>
            <p className="paper-published">{publication.takeaway}</p>
            <div className="paper-actions">
              {pdf && (
                <a className="resource-link" href={pdf}>
                  PDF
                  <Icon name="arrow-up-right" />
                </a>
              )}
              {publication.bibtex && (
                <button
                  className="resource-link"
                  onClick={() => setCitation(publication)}
                >
                  LaTeX
                </button>
              )}
            </div>
            <section aria-labelledby="abstract-title">
              <h2 className="paper-section-title" id="abstract-title">
                Abstract
              </h2>
              <p className="paper-abstract">{publication.abstract}</p>
            </section>
          </article>
          <Footer activeTab="publications" />
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
