import {
  act,
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "../App";
import PublicationList from "../components/PublicationList";
import CitationDialog from "../components/CitationDialog";
import { resourceUrl } from "../utils/urls";
import { useState } from "react";
import baseline from "./fixtures/content.json";
import profile from "../data/profile.json";

const home = () => document.getElementById("home");
const projects = () => document.getElementById("projects");
const normalized = (text) => text.replace(/\s+/g, "");

it("preserves the established text, metrics, methods, artwork geometry, and unique IDs", () => {
  render(<App />);
  for (const [selector, text] of Object.entries(baseline)) {
    expect(
      normalized(document.querySelector(selector).textContent),
      selector,
    ).toBe(normalized(text));
  }
  const ids = [...document.querySelectorAll("[id]")].map(
    (element) => element.id,
  );
  expect(new Set(ids).size).toBe(ids.length);
  expect(
    [...document.querySelectorAll(".pillar-circle")].map((circle) =>
      ["cx", "cy", "r"].map((attribute) => circle.getAttribute(attribute)),
    ),
  ).toEqual([
    ["160", "94.4", "98.4"],
    ["100", "190.4", "98.4"],
    ["220", "190.4", "98.4"],
  ]);
});

it("replaces the Home banner with a portrait-led profile header and a page-scrolling news rail", () => {
  render(<App />);
  expect(home().querySelector(".banner")).not.toBeInTheDocument();
  expect(home().querySelector(".profile-header")).toBeInTheDocument();
  expect(home().querySelector(".profile-header-portrait")).toBeInTheDocument();
  expect(home().querySelector(".profile-header-details")).toHaveTextContent(
    profile.name,
  );
  expect(document.querySelector(".news-rail .news-block")).toBeInTheDocument();
  expect(document.querySelector(".news-list")).not.toHaveStyle({
    overflowY: "auto",
  });
  expect(
    within(document.querySelector(".desktop-news")).getByRole("group", {
      name: "2025 news",
    }),
  ).not.toHaveAttribute("open");
  expect(
    within(document.querySelector(".desktop-news")).getByText(
      "Awarded Second Place in the",
      { exact: false },
    ),
  ).toBeInTheDocument();
});

it("reveals a selected circle's nearest intersection while preserving all four experience rows", () => {
  render(<App />);
  const llms = screen.getByRole("button", {
    name: "Large Language Models: Human–AI Interaction",
  });
  fireEvent.keyDown(llms, { key: "Enter" });
  expect(home().querySelectorAll(".experience-row")).toHaveLength(4);
  expect(home()).toHaveTextContent("Human–AI Interaction");
  expect(home()).toHaveTextContent("Human Oversight");
  expect(llms).toHaveAttribute("aria-pressed", "true");
});

it("uses pointer proximity to switch the reveal window while keeping the hovered circle primary", () => {
  render(<App />);
  const svg = home().querySelector(".foundation-venn");
  vi.spyOn(svg, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: -5,
    top: -5,
    left: 0,
    right: 320,
    bottom: 300,
    width: 320,
    height: 305,
    toJSON: () => ({}),
  });
  const hci = screen.getByRole("button", {
    name: "Human-Computer Interaction: Sociotechnical Systems",
  });

  fireEvent.pointerEnter(hci, {
    clientX: 110,
    clientY: 170,
    pointerType: "mouse",
  });
  expect(home()).toHaveTextContent("Human–AI Interaction");
  expect(home().querySelector(".foundation-reveal")).toHaveClass(
    "window-upper-left",
  );
  expect(hci).toHaveClass("is-primary");

  const moveEvent = new MouseEvent("pointermove", {
    bubbles: true,
    clientX: 210,
    clientY: 170,
  });
  Object.defineProperty(moveEvent, "pointerType", { value: "mouse" });
  fireEvent(svg, moveEvent);
  expect(home()).toHaveTextContent("Sociotechnical Systems");
  expect(home().querySelector(".foundation-reveal")).toHaveClass(
    "window-upper-right",
  );
  expect(hci).toHaveClass("is-primary");
});

it("supports keyboard selection and clearing of SVG circles", () => {
  render(<App />);
  const hci = screen.getByRole("button", {
    name: "Human-Computer Interaction: Sociotechnical Systems",
  });
  fireEvent.keyDown(hci, { key: "Enter" });
  expect(home()).toHaveTextContent("Human–AI Interaction");
  expect(home()).toHaveTextContent("Teaming");
  expect(hci).toHaveAttribute("aria-pressed", "true");
  fireEvent.keyDown(hci, { key: " " });
  expect(hci).toHaveAttribute("aria-pressed", "false");
});

it("routes tabs, supports arrow navigation, and responds to browser history", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("tab", { name: "Projects" }));
  expect(projects()).not.toHaveAttribute("hidden");
  expect(home()).toHaveAttribute("hidden");
  await user.keyboard("{End}");
  expect(screen.getByRole("tab", { name: "About" })).toHaveFocus();
  expect(document.getElementById("about")).not.toHaveAttribute("hidden");
  act(() => {
    window.history.replaceState(null, "", "#publications");
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
  expect(document.getElementById("publications")).not.toHaveAttribute("hidden");
});

it("exposes a keyboard-accessible mobile navigation menu", async () => {
  const user = userEvent.setup();
  render(<App />);
  const menuButton = screen.getByRole("button", {
    name: "Open navigation menu",
  });
  expect(menuButton).toHaveAttribute("aria-expanded", "false");

  await user.click(menuButton);
  expect(menuButton).toHaveAttribute("aria-expanded", "true");
  expect(menuButton).toHaveAccessibleName("Close navigation menu");

  await user.click(screen.getByRole("tab", { name: "Projects" }));
  expect(menuButton).toHaveAttribute("aria-expanded", "false");
});

it("filters publications by their output type", async () => {
  window.history.replaceState(null, "", "#publications");
  const user = userEvent.setup();
  render(<App />);
  const publicationPanel = document.getElementById("publications");
  const typeFilter = screen.getByLabelText("Type");

  await user.selectOptions(typeFilter, "Journal articles");
  expect(typeFilter).toHaveValue("Journal articles");
  expect(
    within(publicationPanel).getByText(
      "The State of Video Game Research in Computer-Supported Cooperative Work – A Systematic Literature Review",
    ),
  ).toBeInTheDocument();
  expect(
    within(publicationPanel).queryByText(
      "Fake Game but Real Play: Exploring Player Motivations and Coping Strategies with Fake Games",
    ),
  ).not.toBeInTheDocument();

  await user.selectOptions(typeFilter, "all");
  expect(typeFilter).toHaveValue("all");
});

it("filters publications by Venn dimensions and exposes matching Venn links", () => {
  window.history.replaceState(
    null,
    "",
    "?dimension=technology&value=Mobile+Games#publications",
  );
  render(<App />);
  const publicationPanel = document.getElementById("publications");
  expect(screen.getByLabelText("Research dimension")).toHaveValue(
    "technology:Mobile Games",
  );
  expect(publicationPanel).toHaveTextContent("Fake Game but Real Play");
  expect(publicationPanel).toHaveTextContent("Wow another fake game");
  expect(publicationPanel).not.toHaveTextContent("Trading as Gambling");

  const decisionSupport = within(home()).getByRole("button", {
    name: "Decision-Support Systems: Applied AI Systems",
    hidden: true,
  });
  fireEvent.keyDown(decisionSupport, { key: "Enter" });
  expect(
    within(home()).getByRole("link", {
      name: "View publications about Players",
      hidden: true,
    }),
  ).toHaveAttribute("href", "?dimension=people&value=Players#publications");
});

it("clears dimension filters when returning to Publications through the top navigation", async () => {
  window.history.replaceState(
    null,
    "",
    "?dimension=phenomena&value=Trust#publications",
  );
  const user = userEvent.setup();
  render(<App />);
  expect(screen.getByLabelText("Research dimension")).toHaveValue(
    "phenomena:Trust",
  );

  await user.click(screen.getByRole("tab", { name: "Home" }));
  await user.click(screen.getByRole("tab", { name: "Publications" }));

  expect(window.location.search).toBe("");
  expect(screen.getByLabelText("Research dimension")).toHaveValue("");
  expect(document.getElementById("publications")).not.toHaveTextContent(
    "Showing publications tagged Trust",
  );
});

it("shows four direct project overviews with a streamlined modal", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("tab", { name: "Projects" }));
  expect(projects().querySelectorAll(".project-card")).toHaveLength(4);
  expect(projects().querySelector(".project-toolbar")).not.toBeInTheDocument();
  expect(
    projects().querySelector(".project-lens-overlay"),
  ).not.toBeInTheDocument();
  expect(projects()).toHaveTextContent("Wellbeing & Health Innovation Lab");
  expect(projects()).toHaveTextContent(
    "Predictive Workflow & Readiness Modeling",
  );
  const triggers = within(projects()).getAllByRole("button", {
    name: "Project overview",
  });
  for (const trigger of triggers) {
    await user.click(trigger);
    const dialog = screen.getByRole("dialog");
    expect(dialog.querySelector(".dialog-lede")).not.toBeInTheDocument();
    expect(dialog.querySelector(".dialog-outcome")).not.toBeInTheDocument();
    expect(dialog.querySelector(".flow-step")).not.toBeInTheDocument();
    expect(
      dialog.querySelector(".dialog-section-title"),
    ).not.toBeInTheDocument();
    expect(dialog.querySelectorAll(".project-dialog-list li")).toHaveLength(3);
    expect(dialog.querySelectorAll(".method-pill")).toHaveLength(3);
    await user.click(
      within(dialog).getByRole("button", { name: "Close project" }),
    );
    expect(trigger).toHaveFocus();
    expect(document.body).not.toHaveClass("modal-open");
  }
  await user.click(triggers[0]);
  fireEvent(
    screen.getByRole("dialog"),
    new Event("cancel", { bubbles: true, cancelable: true }),
  );
  expect(triggers[0]).toHaveFocus();
});

it("resolves initial deep links and leaves the display-only Venn independent", async () => {
  window.history.replaceState(
    null,
    "",
    "#full-paper-gatekeeper-exposure-therapy",
  );
  const user = userEvent.setup();
  render(<App />);
  expect(document.getElementById("publications")).not.toHaveAttribute("hidden");
  await waitFor(() =>
    expect(
      document.getElementById("full-paper-gatekeeper-exposure-therapy"),
    ).toHaveFocus(),
  );
  await user.click(screen.getByRole("tab", { name: "Home" }));
  fireEvent.focus(
    screen.getByRole("button", {
      name: "Decision-Support Systems: Applied AI Systems",
    }),
  );
  fireEvent.keyDown(
    screen.getByRole("button", {
      name: "Decision-Support Systems: Applied AI Systems",
    }),
    { key: "Enter" },
  );
  expect(home()).toHaveTextContent("Sociotechnical Systems");
  expect(home().querySelectorAll(".experience-row")).toHaveLength(4);
});

it("keeps missing resources unavailable and resolves configured resources under the Pages base", () => {
  render(<App />);
  expect(
    home().querySelectorAll(".publication-actions button:disabled"),
  ).toHaveLength(0);
  expect(resourceUrl("javascript:alert(1)")).toBe("");
  expect(resourceUrl("data:text/html,hello")).toBe("");
  expect(resourceUrl("https://example.com/paper.pdf")).toBe(
    "https://example.com/paper.pdf",
  );
  vi.stubEnv("BASE_URL", "/research/");
  expect(resourceUrl("assets/cv.pdf")).toBe(
    `${window.location.origin}/research/assets/cv.pdf`,
  );
  expect(resourceUrl("/assets/cv.pdf")).toBe(
    `${window.location.origin}/research/assets/cv.pdf`,
  );
  vi.unstubAllEnvs();
});

it("opens supplied LaTeX and copies it, with a selectable fallback when clipboard access fails", async () => {
  const user = userEvent.setup();
  const publication = {
    id: "test",
    venue: "Test",
    year: 2026,
    title: "A supplied paper",
    authors: "A. Researcher",
    pillars: ["ai"],
    type: "Paper",
    takeaway: "A supplied takeaway.",
    bibtex: "@article{test, title={A supplied paper}}",
  };
  function CitationHarness() {
    const [citation, setCitation] = useState(null);
    return (
      <>
        <PublicationList
          publications={[publication]}
          onCitation={setCitation}
        />
        <CitationDialog
          publication={citation}
          onClose={() => setCitation(null)}
        />
      </>
    );
  }
  render(<CitationHarness />);
  await user.click(
    screen.getByRole("button", { name: "LaTeX for A supplied paper" }),
  );
  const clipboard = vi
    .spyOn(navigator.clipboard, "writeText")
    .mockResolvedValue();
  await user.click(screen.getByRole("button", { name: "Copy LaTeX" }));
  expect(clipboard).toHaveBeenCalledWith(publication.bibtex);
  clipboard.mockRejectedValue(new Error("Denied"));
  await user.click(screen.getByRole("button", { name: "Copied" }));
  expect(window.getSelection().toString()).toBe(publication.bibtex);
});
