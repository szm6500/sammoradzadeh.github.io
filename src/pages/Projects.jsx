import { useState } from "react";
import projects from "../data/projects.json";
import copy from "../data/copy.json";
import PageHeading from "../components/PageHeading";
import ProjectArtwork from "../components/ProjectArtwork";
import OrganizationBadge from "../components/OrganizationBadge";
import MethodPills from "../components/MethodPills";
import Icon from "../components/Icon";
import Dialog from "../components/Dialog";

const projectVisuals = {
  "wtw-analytics-ai": {
    color: "amber",
    artwork: "wtw",
    logo: "/assets/logos/willis-towers-watson.jpg",
    monogram: "WTW",
  },
  "las-workflow-modeling": {
    color: "teal",
    artwork: "las",
    logo: "/assets/logos/laboratory-for-analytic-sciences.png",
    monogram: "LAS",
  },
  "whi-clinical-ai": {
    color: "indigo",
    artwork: "whil",
    logo: "/assets/logos/wellbeing-health-innovation-lab.png",
    monogram: "PSU",
  },
  "cie-vr-systems": {
    color: "slate",
    artwork: "cie",
    logo: "/assets/logos/penn-state-icds.jpg",
    monogram: "PSU",
  },
};

export default function Projects() {
  const [project, setProject] = useState(null);

  return (
    <>
      <div className="wide-page-heading">
        <PageHeading {...copy.projects} />
      </div>
      <div className="projects-grid">
        {projects.map((item, index) => {
          const visual = projectVisuals[item.id];
          return (
            <article className="project-card" key={item.id}>
              <div className={`project-visual ${visual.color}`}>
                <span className="project-number">
                  PROJECT / {String(index + 1).padStart(2, "0")}
                </span>
                <ProjectArtwork id={visual.artwork} />
              </div>
              <div className="project-body">
                <div className="project-organization">
                  <OrganizationBadge
                    src={visual.logo}
                    label={item.organization}
                    monogram={visual.monogram}
                    large
                  />
                  <span className="eyebrow">{item.organization}</span>
                </div>
                <h2>{item.title}</h2>
                <p className="project-meta">
                  {item.role} · {item.timeline}
                </p>
                <p>{item.summary}</p>
                <MethodPills methods={item.techStack.slice(0, 3)} />
                <button
                  className="project-open"
                  onClick={() => setProject(item)}
                  aria-haspopup="dialog"
                >
                  <span>{copy.projects.open}</span>
                  <Icon name="arrow-up-right" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <Dialog
        id="project-dialog"
        open={Boolean(project)}
        onClose={() => setProject(null)}
        eyebrow={
          project &&
          `${project.organization} · ${project.role} · ${project.timeline}`
        }
        eyebrowPrefix={
          project && (
            <OrganizationBadge
              src={projectVisuals[project.id].logo}
              label={project.organization}
              monogram={projectVisuals[project.id].monogram}
            />
          )
        }
        titleId="dialog-title"
        closeLabel="Close project"
      >
        <h2 id="dialog-title">{project?.title}</h2>
        <p className="project-dialog-context">{project?.context}</p>
        <ul className="project-dialog-list">
          {project?.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <MethodPills methods={project ? project.techStack.slice(0, 3) : []} />
      </Dialog>
    </>
  );
}
