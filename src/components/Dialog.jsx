import { useEffect, useRef } from "react";
import Icon from "./Icon";

/** Native dialog supplies focus trapping, inert background, and Escape support. */
export default function Dialog({
  open,
  onClose,
  titleId,
  closeLabel,
  eyebrow,
  eyebrowPrefix,
  children,
  id,
}) {
  const dialogRef = useRef(null);
  const closeButton = useRef(null);
  useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement;
    const dialog = dialogRef.current;
    dialog.showModal();
    document.body.classList.add("modal-open");
    closeButton.current.focus();
    return () => {
      if (dialog.open) dialog.close();
      document.body.classList.remove("modal-open");
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [open]);
  function backdropClick(event) {
    if (event.target !== dialogRef.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      onClose();
  }
  return (
    <dialog
      ref={dialogRef}
      id={id}
      aria-labelledby={titleId}
      onClick={backdropClick}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="dialog-inner">
        <div className="dialog-top">
          <p className={`eyebrow ${eyebrowPrefix ? "dialog-eyebrow" : ""}`}>
            {eyebrowPrefix}
            {eyebrow}
          </p>
          <button
            ref={closeButton}
            className="dialog-close"
            onClick={onClose}
            aria-label={closeLabel}
          >
            <Icon name="x" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
