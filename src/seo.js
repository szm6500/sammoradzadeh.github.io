import copy from "./data/copy.json";
import profile from "./data/profile.json";
import publications from "./data/publications.json";
import { paperPath, tabPath } from "./utils/routes";
import { bibtexAuthors, bibtexFields } from "./utils/bibtex";

const escape = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const meta = (attribute, key, content) =>
  `<meta ${attribute}="${key}" content="${escape(content)}" />`;

function summary(text, limit = 158) {
  if (text.length <= limit) return text;
  return `${text.slice(0, text.lastIndexOf(" ", limit - 1))}…`;
}

const sameAs = [
  "https://orcid.org/0000-0001-6221-1426",
  "https://www.wikidata.org/wiki/Q130826613",
  "https://ist.psu.edu/directory/szm6500",
  "https://scholar.google.com/citations?user=Q_BC5_4AAAAJ",
  "https://github.com/szm6500",
  "https://www.linkedin.com/in/sam-moradzadeh/",
];

function person(siteUrl) {
  return {
    "@type": "Person",
    "@id": `${siteUrl}#sam-moradzadeh`,
    name: profile.name,
    givenName: "Sam",
    familyName: "Moradzadeh",
    jobTitle: "Ph.D. Candidate and AI Researcher",
    description:
      "Ph.D. candidate in Informatics at Penn State researching human-centered AI, large language models, and decision-support systems for digital health and high-stakes professional work.",
    url: siteUrl,
    image: `${siteUrl}assets/profile-photo.jpg`,
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "Pennsylvania State University",
      url: "https://www.psu.edu",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Pennsylvania State University",
    },
    knowsAbout: [
      "Human-Computer Interaction",
      "Human-Centered AI",
      "Large Language Models",
      "Decision-Support Systems",
      "Digital Health",
      "Behavioral Data Science",
    ],
    sameAs,
  };
}

/** Publications that get their own page (the ones with an abstract). */
export const papers = publications.filter((item) => item.abstract);

/** Served by GitHub Pages for any missing path; kept out of the sitemap. */
export const notFoundPage = {
  path: `${import.meta.env.BASE_URL}404.html`,
  notFound: true,
};

/** Every prerendered page. */
export const pages = [
  ...copy.tabs.map((tab) => ({ path: tabPath(tab.id), tab: tab.id })),
  ...papers.map((paper) => ({ path: paperPath(paper.id), paper: paper.id })),
];

function tabHead(tab, url, siteUrl) {
  const { title, description } = copy.tabs.find((item) => item.id === tab);
  const jsonLd =
    tab === "home"
      ? {
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          mainEntity: person(siteUrl),
        }
      : {
          "@context": "https://schema.org",
          "@type": tab === "publications" ? "CollectionPage" : "WebPage",
          name: title,
          url,
          about: { "@id": `${siteUrl}#sam-moradzadeh` },
        };
  return {
    title,
    description,
    type: tab === "home" ? "profile" : "website",
    tags:
      tab === "home"
        ? [
            meta("property", "profile:first_name", "Sam"),
            meta("property", "profile:last_name", "Moradzadeh"),
          ]
        : [],
    jsonLd,
  };
}

function paperHead(paper, url, siteUrl) {
  const fields = bibtexFields(paper.bibtex);
  const authors = bibtexAuthors(paper.bibtex);
  const pdf = paper.pdf.startsWith("assets/")
    ? new URL(`${import.meta.env.BASE_URL}${paper.pdf}`, siteUrl).href
    : "";
  const container = fields.journal
    ? ["citation_journal_title", fields.journal]
    : ["citation_conference_title", fields.booktitle || paper.venue];
  const tags = [
    meta("name", "citation_title", paper.title),
    ...authors.map((author) => meta("name", "citation_author", author)),
    meta("name", "citation_publication_date", String(paper.year)),
    meta("name", ...container),
    ...[
      ["volume", "citation_volume"],
      ["number", "citation_issue"],
      ["doi", "citation_doi"],
      ["publisher", "citation_publisher"],
    ]
      .filter(([key]) => fields[key])
      .map(([key, name]) => meta("name", name, fields[key])),
    ...(fields.pages?.includes("-")
      ? [
          meta("name", "citation_firstpage", fields.pages.split(/-+/)[0]),
          meta("name", "citation_lastpage", fields.pages.split(/-+/).at(-1)),
        ]
      : []),
    meta("name", "citation_abstract_html_url", url),
    ...(pdf ? [meta("name", "citation_pdf_url", pdf)] : []),
  ];
  return {
    title: `${paper.title} · ${profile.name}`,
    description: summary(paper.abstract),
    type: "article",
    tags,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ScholarlyArticle",
      headline: paper.title,
      name: paper.title,
      abstract: paper.abstract,
      datePublished: String(paper.year),
      url,
      author: authors.map((author) => {
        const [family, given] = author.split(/,\s*/);
        const name = given ? `${given} ${family}` : family;
        return name === profile.name
          ? { "@id": `${siteUrl}#sam-moradzadeh` }
          : { "@type": "Person", name };
      }),
      isPartOf: { "@type": "Periodical", name: container[1] },
      ...(pdf && { encoding: { "@type": "MediaObject", contentUrl: pdf } }),
      ...(fields.doi && { sameAs: `https://doi.org/${fields.doi}` }),
    },
  };
}

/** The <head> tags for a page; siteUrl is the absolute site root ending in "/". */
export function renderHead(page, siteUrl) {
  const url = new URL(page.path, siteUrl).href;
  if (page.notFound)
    return [
      `<title>Page not found · ${escape(profile.name)}</title>`,
      meta("name", "robots", "noindex"),
    ].join("\n    ");
  const head = page.paper
    ? paperHead(
        papers.find((item) => item.id === page.paper),
        url,
        siteUrl,
      )
    : tabHead(page.tab, url, siteUrl);
  const image = `${siteUrl}assets/social-card.jpg`;
  return [
    `<title>${escape(head.title)}</title>`,
    meta("name", "description", head.description),
    meta("name", "author", profile.name),
    meta("name", "robots", "index, follow, max-image-preview:large"),
    `<link rel="canonical" href="${escape(url)}" />`,
    meta("property", "og:type", head.type),
    meta("property", "og:site_name", profile.name),
    meta("property", "og:title", head.title),
    meta("property", "og:description", head.description),
    meta("property", "og:url", url),
    meta("property", "og:image", image),
    meta("property", "og:image:width", "1200"),
    meta("property", "og:image:height", "630"),
    meta("property", "og:image:alt", `${profile.name}, ${profile.title}`),
    meta("name", "twitter:card", "summary_large_image"),
    meta("name", "twitter:title", head.title),
    meta("name", "twitter:description", head.description),
    meta("name", "twitter:image", image),
    ...head.tags,
    `<script type="application/ld+json">${JSON.stringify(head.jsonLd).replace(/</g, "\\u003c")}</script>`,
  ].join("\n    ");
}
