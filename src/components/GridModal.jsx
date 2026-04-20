import { useState, useEffect } from "react";
import "../styles/GridModal.css";
import BoxGrid from "./BoxGrid";

export default function GridModal({ boxes, isOpen, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
      document.documentElement.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
      document.documentElement.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
      document.documentElement.classList.remove("modal-open");
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 250);
  };

  if (!isOpen) return null;

  const assignedCount = boxes.filter(b => b !== null).length;

  return (
    <div className={`grid-modal-overlay ${isClosing ? "closing" : ""}`} onClick={handleClose}>
      <div className={`grid-modal-content ${isClosing ? "closing" : ""}`} onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button className="grid-modal-close" onClick={handleClose} title="Close" aria-label="Close grid modal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18" /><path d="M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="grid-modal-header">
          <div className="grid-modal-title-row">
            <div className="grid-modal-icon">📦</div>
            <div>
              <h2>Box Grid Editor</h2>
              <p>View all 100 boxes — <strong>{assignedCount}</strong> assigned</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="grid-modal-body">
          <BoxGrid boxes={boxes} />
        </div>

        {/* Footer */}
        <div className="grid-modal-footer">
          <button className="btn btn-primary" onClick={handleClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
