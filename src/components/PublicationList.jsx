import { resourceUrl } from "../utils/urls";
import profile from "../data/profile.json";
import Icon from "./Icon";

function AuthorList({ authors }) {
  const parts = authors.split(profile.name);
  return parts.map((part, index) => (
    <span key={`${part}-${index}`}>
      {part}
      {index < parts.length - 1 && <strong>{profile.name}</strong>}
    </span>
  ));
}

function ResourceLink({ publication, kind, label, onCitation }) {
  if (kind === "bibtex")
    return (
      <button
        className="resource-link"
        disabled={!publication.bibtex}
        title={publication.bibtex ? undefined : "Citation not yet available"}
        aria-label={`${label} for ${publication.title || publication.label}`}
        onClick={() => onCitation(publication)}
      >
        {label}
      </button>
    );
  const href = resourceUrl(publication[kind]);
  return href ? (
    <a
      className="resource-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} for ${publication.title || publication.label}`}
    >
      {label}
      <Icon name="arrow-up-right" />
    </a>
  ) : (
    <button
      className="resource-link"
      disabled
      title={`${label} not yet available`}
      aria-label={`${label} not yet available`}
    >
      {label}
    </button>
  );
}

export default function PublicationList({
  publications,
  prefix = "paper",
  pulseId,
  onCitation,
}) {
  return (
    <div className="publications-list">
      {publications.map((publication) => {
        const id = `${prefix}-${publication.id}`;
        return (
          <article
            key={id}
            id={id}
            tabIndex={-1}
            className={`publication-card ${prefix === "paper" ? "research-card" : ""} ${pulseId === id ? "anchor-pulse" : ""}`}
          >
            <div className="venue-badge">
              {publication.venue}
              <span className="venue-year">
                {publication.year}
                {publication.status ? " · Sub." : ""}
              </span>
              <span className="venue-type">{publication.type}</span>
            </div>
            <div>
              <h3 className="publication-title">
                {publication.title || publication.label}
              </h3>
              <p className="publication-authors">
                {publication.authors ? (
                  <AuthorList authors={publication.authors} />
                ) : (
                  "Author list forthcoming"
                )}
              </p>
              <p className="publication-takeaway">{publication.takeaway}</p>
              {!publication.title && (
                <span className="placeholder-label">Topic placeholder</span>
              )}
              {(publication.acceptanceRate ||
                publication.awards?.length > 0 ||
                publication.highlights?.length > 0) && (
                <div className="publication-recognition">
                  {publication.acceptanceRate && (
                    <span className="acceptance-rate">
                      {publication.acceptanceRate} acceptance rate
                    </span>
                  )}
                  {publication.awards?.map((award) => (
                    <span className="publication-award" key={award}>
                      <Icon name="award" />
                      Award · {award}
                    </span>
                  ))}
                  {publication.highlights?.map((highlight) => (
                    <span className="publication-highlight" key={highlight}>
                      {highlight}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="publication-actions">
              {[
                ["pdf", "PDF"],
                ["bibtex", "LaTeX"],
              ].map(([kind, label]) => (
                <ResourceLink
                  key={kind}
                  publication={publication}
                  kind={kind}
                  label={label}
                  onCitation={onCitation}
                />
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
