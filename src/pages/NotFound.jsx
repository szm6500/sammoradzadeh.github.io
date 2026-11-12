import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { tabPath } from "../utils/routes";

export default function NotFound() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar
        activeTab={null}
        navigate={(href) => window.location.assign(href)}
        standalone
      />
      <div className="layout">
        <main className="main" id="main-content" tabIndex={-1}>
          <article className="paper-page">
            <p className="paper-venue">404</p>
            <h1 className="paper-title">This page doesn’t exist</h1>
            <p className="paper-abstract">
              The link may be old or mistyped. Try the{" "}
              <a href={tabPath("home")}>home page</a> or the list of{" "}
              <a href={tabPath("publications")}>publications</a>.
            </p>
          </article>
          <Footer activeTab="home" />
        </main>
        <Sidebar />
      </div>
    </>
  );
}
