import profile from "../data/profile.json";
import publications from "../data/publications.json";
import copy from "../data/copy.json";
import RichText from "../components/RichText";
import ProfileHeader from "../components/ProfileHeader";
import Sidebar from "../components/Sidebar";
import VennDiagram from "../components/VennDiagram";
import ExperienceGrid from "../components/ExperienceGrid";
import PublicationList from "../components/PublicationList";
import SectionHeading from "../components/SectionHeading";

export default function Home({ pulseId, onCitation }) {
  return (
    <>
      <ProfileHeader />
      <div className="intro">
        <h1>
          {profile.home.heading[0]}
          {profile.home.heading[1] && (
            <>
              {" "}
              <span className="intro-title-plus" aria-hidden="true">
                +
              </span>{" "}
              <span>{profile.home.heading[1]}</span>
            </>
          )}
        </h1>
        <div className="intro-copy">
          {profile.home.bio.map((paragraph) => (
            <p key={paragraph.map((segment) => segment.text).join("")}>
              <RichText segments={paragraph} />
            </p>
          ))}
        </div>
      </div>
      <VennDiagram />
      <Sidebar mobile />
      <ExperienceGrid pulseId={pulseId} />
      <section
        className="publications-section"
        aria-labelledby="selected-pubs-title"
      >
        <SectionHeading
          id="selected-pubs-title"
          title={copy.selectedPublications.title}
          href="#publications"
          link={copy.selectedPublications.link}
        />
        <PublicationList
          publications={[...publications]
            .sort((a, b) => b.year - a.year)
            .slice(0, 4)}
          pulseId={pulseId}
          onCitation={onCitation}
        />
      </section>
    </>
  );
}
