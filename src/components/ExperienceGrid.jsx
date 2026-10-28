import experience from "../data/experience.json";
import copy from "../data/copy.json";
import OrganizationBadge from "./OrganizationBadge";
import SectionHeading from "./SectionHeading";

const organizationMarks = {
  "experience-whil": {
    src: "/assets/logos/wellbeing-health-innovation-lab.png",
    monogram: "PSU",
  },
  "experience-las": {
    src: "/assets/logos/laboratory-for-analytic-sciences.png",
    monogram: "LAS",
  },
  "experience-wtw": {
    src: "/assets/logos/willis-towers-watson.jpg",
    monogram: "WTW",
  },
  "experience-cie": {
    src: "/assets/logos/penn-state-icds.jpg",
    monogram: "PSU",
  },
};

export default function ExperienceGrid({ pulseId }) {
  return (
    <section className="experience-section" aria-labelledby="experience-title">
      <SectionHeading
        id="experience-title"
        title={copy.selectedExperience.title}
        href="#projects"
        link={copy.selectedExperience.link}
      />
      <div className="experience-grid">
        {experience.map((item) => {
          const mark = organizationMarks[item.id];
          return (
            <article
              key={item.id}
              id={item.id}
              tabIndex={-1}
              className={`experience-row ${pulseId === item.id ? "anchor-pulse" : ""}`}
            >
              <a
                className="experience-row-link"
                href="#projects"
                aria-label={`View ${item.org} project details`}
              >
                <div className="experience-row-topline">
                  <div className="experience-row-identity">
                    <OrganizationBadge
                      src={mark.src}
                      label={item.org}
                      monogram={mark.monogram}
                    />
                    <h3>{item.org}</h3>
                    <span aria-hidden="true">·</span>
                    <p>{item.role}</p>
                  </div>
                  <time>{item.date}</time>
                </div>
                <p className="experience-row-summary">{item.summary}</p>
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
