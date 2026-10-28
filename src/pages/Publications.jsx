import { useEffect, useState } from "react";
import publications from "../data/publications.json";
import intersections from "../data/researchIntersections.json";
import copy from "../data/copy.json";
import PageHeading from "../components/PageHeading";
import PublicationList from "../components/PublicationList";

const publicationTypeFilters = {
  "Conference papers": ["Paper"],
  "Journal articles": ["Journal article"],
  "Posters & workshops": ["Poster", "Workshop"],
};

const dimensionGroups = Object.values(
  intersections
    .flatMap((intersection) => intersection.groups)
    .reduce((groups, group) => {
      const key = group.label.toLowerCase();
      if (!groups[key]) groups[key] = { key, label: group.label, terms: [] };
      groups[key].terms = [...new Set([...groups[key].terms, ...group.terms])];
      return groups;
    }, {}),
);

function filterFromUrl() {
  const parameters = new URLSearchParams(window.location.search);
  const dimension = parameters.get("dimension");
  const value = parameters.get("value");
  const group = dimensionGroups.find((item) => item.key === dimension);
  return group?.terms.includes(value) ? { dimension, value } : null;
}

export default function Publications({ activeTab, onCitation, pulseId }) {
  const [activeType, setActiveType] = useState("all");
  const [activeDimension, setActiveDimension] = useState(filterFromUrl);

  useEffect(() => {
    const syncFilter = () => setActiveDimension(filterFromUrl());
    window.addEventListener("popstate", syncFilter);
    return () => window.removeEventListener("popstate", syncFilter);
  }, []);

  useEffect(() => {
    if (activeTab !== "publications") return;
    setActiveType("all");
    setActiveDimension(filterFromUrl());
  }, [activeTab]);

  const filteredPublications = publications.filter((publication) => {
    const matchesType =
      activeType === "all" ||
      publicationTypeFilters[activeType].includes(publication.type);
    const matchesDimension =
      !activeDimension ||
      publication.dimensions?.[activeDimension.dimension]?.includes(
        activeDimension.value,
      );
    return matchesType && matchesDimension;
  });
  const years = [
    ...new Set(filteredPublications.map((publication) => publication.year)),
  ].sort((a, b) => b - a);

  function setDimensionFilter(dimension, value) {
    const next =
      !dimension ||
      (activeDimension?.dimension === dimension &&
        activeDimension.value === value)
        ? null
        : { dimension, value };
    setActiveDimension(next);
    const parameters = new URLSearchParams(window.location.search);
    if (next) {
      parameters.set("dimension", next.dimension);
      parameters.set("value", next.value);
    } else {
      parameters.delete("dimension");
      parameters.delete("value");
    }
    const query = parameters.toString();
    window.history.replaceState(
      null,
      "",
      `${query ? `?${query}` : ""}#publications`,
    );
  }

  return (
    <>
      <div className="wide-page-heading">
        <PageHeading {...copy.publications} />
      </div>
      <section className="publication-filters" aria-label="Filter publications">
        <label className="filter-select-label" htmlFor="publication-type">
          <span>Type</span>
          <select
            id="publication-type"
            value={activeType}
            onChange={(event) => setActiveType(event.target.value)}
          >
            <option value="all">All publication types</option>
            {copy.publications.types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <div className="dimension-select-row">
          <label
            className="filter-select-label dimension-select-label"
            htmlFor="research-dimension"
          >
            <span>Research dimension</span>
            <select
              id="research-dimension"
              value={
                activeDimension
                  ? `${activeDimension.dimension}:${activeDimension.value}`
                  : ""
              }
              onChange={(event) => {
                if (!event.target.value) {
                  setDimensionFilter(null, null);
                  return;
                }
                const [dimension, value] = event.target.value.split(":");
                setDimensionFilter(dimension, value);
              }}
            >
              <option value="">All research dimensions</option>
              {dimensionGroups.map((group) => (
                <optgroup label={group.label} key={group.key}>
                  {group.terms.map((term) => (
                    <option key={term} value={`${group.key}:${term}`}>
                      {term}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          {activeDimension && (
            <button
              className="dimension-reset"
              onClick={() => setDimensionFilter(null, null)}
            >
              Show all
            </button>
          )}
        </div>
      </section>
      {activeDimension && (
        <p className="publication-filter-status" aria-live="polite">
          Showing publications tagged <strong>{activeDimension.value}</strong>
        </p>
      )}
      {filteredPublications.length === 0 && (
        <p className="publication-empty" role="status">
          No publications are tagged with this dimension yet.
        </p>
      )}
      {years.map((year) => {
        const items = filteredPublications.filter(
          (publication) => publication.year === year,
        );
        return (
          <section
            className="year-group"
            key={year}
            aria-label={`Publications from ${year}`}
          >
            <h2 className="year-heading">
              {year}
              <span>
                {items.length}{" "}
                {items.length === 1 ? "publication" : "publications"}
              </span>
            </h2>
            <PublicationList
              publications={items}
              prefix="full-paper"
              onCitation={onCitation}
              pulseId={pulseId}
            />
          </section>
        );
      })}
    </>
  );
}
