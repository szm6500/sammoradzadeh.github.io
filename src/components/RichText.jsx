import { Fragment } from "react";

/** Structured text preserves emphasis and line breaks without accepting raw HTML. */
export default function RichText({ segments }) {
  return segments.map((segment, index) => {
    if (segment.break)
      return (
        <Fragment key={index}>
          <br />
        </Fragment>
      );

    const content = segment.strong ? (
      <strong>{segment.text}</strong>
    ) : (
      segment.text
    );
    return (
      <Fragment key={index}>
        {segment.href ? (
          <a href={segment.href} target="_blank" rel="noreferrer">
            {content}
          </a>
        ) : (
          content
        )}
      </Fragment>
    );
  });
}
