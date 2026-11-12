import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import Paper from "./pages/Paper";
import NotFound from "./pages/NotFound";
import { notFoundPage, pages, papers, renderHead } from "./seo";

export { notFoundPage, pages, renderHead };
export const base = import.meta.env.BASE_URL;

export function render(page) {
  const paper = papers.find((item) => item.id === page.paper);
  return renderToString(
    <StrictMode>
      {page.notFound ? (
        <NotFound />
      ) : paper ? (
        <Paper publication={paper} />
      ) : (
        <App initialTab={page.tab} />
      )}
    </StrictMode>,
  );
}
