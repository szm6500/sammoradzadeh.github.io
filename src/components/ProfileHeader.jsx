import { Fragment, useState } from "react";
import profile from "../data/profile.json";
import copy from "../data/copy.json";
import Icon from "./Icon";
import PortraitPlaceholder from "./PortraitPlaceholder";
import { resourceUrl } from "../utils/urls";

/** The personal header replaces the decorative Home banner. */
export default function ProfileHeader() {
  const [photoFailed, setPhotoFailed] = useState(false);
  const photo = resourceUrl(profile.photo, { image: true });

  return (
    <section className="profile-header" aria-label="Researcher profile">
      <div className="profile-header-portrait">
        {photo && !photoFailed ? (
          <img
            src={photo}
            alt={`Portrait of ${profile.name}`}
            className="h-full w-full object-cover"
            onError={() => setPhotoFailed(true)}
          />
        ) : (
          <>
            <PortraitPlaceholder />
            <span className="portrait-caption">{profile.portraitCaption}</span>
          </>
        )}
      </div>
      <div className="profile-header-details">
        {/* <p className="eyebrow profile-header-eyebrow">Research profile</p> */}
        <h2 className="profile-name">{profile.name}</h2>
        <p className="profile-role">
          {profile.role.map((line, index) => (
            <Fragment key={line}>
              {index > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </p>
        <p className="affiliation">
          <Icon name="map-pin" />
          <span>{profile.affiliation}</span>
        </p>
        <div className="socials" aria-label="Contact and profiles">
          {copy.socials.map((social) => {
            const value = profile.links[social.key];
            const href = resourceUrl(
              social.key === "email" && value && !value.startsWith("mailto:")
                ? `mailto:${value}`
                : value,
              { email: social.key === "email" },
            );
            return (
              <a
                className="social-link"
                key={social.key}
                href={href || "#"}
                aria-disabled={!href || undefined}
                aria-label={`${social.label}${href ? "" : ", link forthcoming"}`}
                title={`${social.label}${href ? "" : " link forthcoming"}`}
                target={href && social.key !== "email" ? "_blank" : undefined}
                rel="noopener noreferrer"
              >
                <Icon name={social.icon} />
              </a>
            );
          })}
        </div>
        {profile.tagline && (
          <p className="profile-note">
            <span className="status-dot" aria-hidden="true" />
            {profile.tagline}
          </p>
        )}
      </div>
    </section>
  );
}
