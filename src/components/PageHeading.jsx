// Only the visible tab's heading is the page h1; hidden tabs use h2.
export default function PageHeading({
  eyebrow,
  heading,
  description,
  active = true,
}) {
  const Heading = active ? "h1" : "h2";
  return (
    <div className="page-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Heading>
        {heading[0]}
        {heading[1] && (
          <>
            {" "}
            <span>{heading[1]}</span>
          </>
        )}
      </Heading>
      {description && <p>{description}</p>}
    </div>
  );
}
