export default function PageHeading({ eyebrow, heading, description }) {
  return (
    <div className="page-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>
        {heading[0]}
        {heading[1] && (
          <>
            {" "}
            <span>{heading[1]}</span>
          </>
        )}
      </h1>
      {description && <p>{description}</p>}
    </div>
  );
}
