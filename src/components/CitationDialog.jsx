import { useEffect, useRef, useState } from "react";
import Dialog from "./Dialog";

export default function CitationDialog({ publication, onClose }) {
  const [status, setStatus] = useState("");
  const citationRef = useRef(null);
  useEffect(() => setStatus(""), [publication]);
  async function copyCitation() {
    try {
      await navigator.clipboard.writeText(publication.bibtex);
      setStatus("copied");
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(citationRef.current);
      selection.removeAllRanges();
      selection.addRange(range);
      setStatus("selected");
    }
  }
  return (
    <Dialog
      id="citation-dialog"
      open={Boolean(publication)}
      onClose={onClose}
      titleId="citation-title"
      eyebrow="LaTeX reference"
      closeLabel="Close LaTeX reference"
    >
      <h2 id="citation-title">LaTeX citation</h2>
      <pre className="citation-text" ref={citationRef}>
        {publication?.bibtex}
      </pre>
      <button className="copy-button" onClick={copyCitation}>
        {status === "copied"
          ? "Copied"
          : status === "selected"
            ? "Selected — press ⌘C / Ctrl+C"
            : "Copy LaTeX"}
      </button>
      <span className="sr-only" role="status">
        {status === "copied"
          ? "Citation copied to clipboard."
          : status === "selected"
            ? "Citation selected. Press Command+C or Control+C to copy."
            : ""}
      </span>
    </Dialog>
  );
}
