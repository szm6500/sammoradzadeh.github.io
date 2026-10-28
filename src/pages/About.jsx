import { useState } from "react";
import profile from "../data/profile.json";
import Dialog from "../components/Dialog";
import PageHeading from "../components/PageHeading";
import { resourceUrl } from "../utils/urls";

function CarPhoto({ photo, onOpen }) {
  const [unavailable, setUnavailable] = useState(false);
  const src = resourceUrl(photo.src, { image: true });

  return (
    <button
      className={`about-photo ${unavailable ? "is-unavailable" : ""}`}
      onClick={() => !unavailable && onOpen(photo)}
      aria-label={
        unavailable ? `${photo.caption} image unavailable` : photo.caption
      }
      disabled={unavailable}
    >
      {!unavailable && (
        <img
          src={src}
          alt={photo.caption}
          onError={() => setUnavailable(true)}
        />
      )}
      <span className="about-photo-caption">{photo.caption}</span>
      {unavailable && (
        <span className="about-photo-placeholder">Add photo</span>
      )}
    </button>
  );
}

export default function About() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <>
      <div className="about-column">
        <PageHeading {...profile.about} />

        <section className="about-section" aria-labelledby="background-title">
          <h2 id="background-title">Background</h2>
          <div className="about-background">
            {profile.about.background.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section
          className="about-section about-outside"
          aria-labelledby="outside-title"
        >
          <h2 id="outside-title">Outside the Lab</h2>
          <p className="about-outside-intro">{profile.about.outsideIntro}</p>
          <div className="about-interests">
            {profile.about.interests.map((interest) => (
              <p key={interest.title}>
                <strong>{interest.title}.</strong> {interest.text}
              </p>
            ))}
          </div>
        </section>

        <section
          className="about-section about-photos-section"
          aria-labelledby="spotted-title"
        >
          <h2 id="spotted-title">Spotted in the Wild</h2>
          <div className="about-photo-grid">
            {profile.about.carPhotos.map((photo) => (
              <CarPhoto
                key={photo.src}
                photo={photo}
                onOpen={setSelectedPhoto}
              />
            ))}
          </div>
        </section>
      </div>

      <Dialog
        id="about-photo-dialog"
        open={Boolean(selectedPhoto)}
        onClose={() => setSelectedPhoto(null)}
        eyebrow="Spotted in the Wild"
        titleId="about-photo-title"
        closeLabel="Close photo"
      >
        <h2 id="about-photo-title">{selectedPhoto?.caption}</h2>
        {selectedPhoto && (
          <img
            className="about-lightbox-image"
            src={resourceUrl(selectedPhoto.src, { image: true })}
            alt={selectedPhoto.caption}
          />
        )}
      </Dialog>
    </>
  );
}
