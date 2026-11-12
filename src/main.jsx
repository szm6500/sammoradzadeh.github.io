import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import Paper from "./pages/Paper";
import NotFound from "./pages/NotFound";
import publications from "./data/publications.json";
import { paperFromPath, tabFromPath } from "./utils/routes";
import "./styles/main.css";

function page(pathname) {
  const paperId = paperFromPath(pathname);
  const paper = publications.find(
    (item) => item.id === paperId && item.abstract,
  );
  if (paper) return <Paper publication={paper} />;
  const tab = tabFromPath(pathname);
  return tab ? <App initialTab={tab} /> : <NotFound />;
}

const root = document.getElementById("root");
const app = <StrictMode>{page(window.location.pathname)}</StrictMode>;

if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
