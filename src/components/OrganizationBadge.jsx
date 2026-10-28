import { useState } from "react";
import { resourceUrl } from "../utils/urls";

/** Compact organization mark with a text fallback for missing local assets. */
export default function OrganizationBadge({
  src,
  label,
  monogram,
  large = false,
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = resourceUrl(src, { image: true });

  return (
    <span
      className={`organization-badge rounded-md border border-slate-200/80 bg-white p-0.5 shadow-2xs ${large ? "organization-badge-large" : "h-6 w-6"}`}
      aria-label={`${label} logo`}
      title={label}
    >
      {imageSrc && !imageFailed ? (
        <img src={imageSrc} alt="" onError={() => setImageFailed(true)} />
      ) : (
        <span aria-hidden="true">{monogram}</span>
      )}
    </span>
  );
}
