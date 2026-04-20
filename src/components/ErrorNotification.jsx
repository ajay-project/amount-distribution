import { useState, useEffect } from "react";
import "../styles/ErrorNotification.css";

export default function ErrorNotification({
  message,
  type = "error",
  onClose,
  autoClose = true,
  duration = 4000,
}) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!message) return;
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, autoClose, duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 250);
  };

  if (!message) return null;

  const config = {
    error: { icon: "✕", color: "error" },
    warning: { icon: "!", color: "warning" },
    info: { icon: "i", color: "info" },
    success: { icon: "✓", color: "success" },
  };

  const { icon, color } = config[type] || config.error;

  return (
    <div className={`notification notification-${color} ${isClosing ? "closing" : ""}`}>
      <div className="notification-inner">
        <div className={`notification-icon-circle notification-icon-${color}`}>
          <span>{icon}</span>
        </div>
        <span className="notification-message">{message}</span>
        <button className="notification-close" onClick={handleClose} title="Dismiss" aria-label="Dismiss notification">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18" /><path d="M6 6l12 12" />
          </svg>
        </button>
      </div>
      {/* Auto-close progress bar */}
      {autoClose && <div className="notification-timer" style={{ animationDuration: `${duration}ms` }}></div>}
    </div>
  );
}
