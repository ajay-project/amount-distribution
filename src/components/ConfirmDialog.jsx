import { useState, useEffect } from "react";
import "../styles/ConfirmDialog.css";

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  type = "info",
}) {
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

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onConfirm();
    }, 250);
  };

  const handleCancel = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onCancel();
    }, 250);
  };

  const iconConfig = {
    warning: { emoji: "⚠️", className: "warning" },
    error: { emoji: "❌", className: "error" },
    info: { emoji: "ℹ️", className: "info" },
    success: { emoji: "✅", className: "success" },
  };

  const { emoji, className } = iconConfig[type] || iconConfig.info;

  return (
    <div className={`confirm-overlay ${isClosing ? "closing" : ""}`}>
      <div className={`confirm-dialog ${isClosing ? "closing" : ""}`}>
        <div className="confirm-header">
          <div className={`confirm-icon-wrap ${className}`}>
            <span>{emoji}</span>
          </div>
          <h2>{title}</h2>
        </div>

        <div className="confirm-body">
          <p>{message}</p>
        </div>

        <div className="confirm-footer">
          <button className="btn btn-cancel" onClick={handleCancel}>
            {cancelText}
          </button>
          <button className="btn btn-primary" onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
