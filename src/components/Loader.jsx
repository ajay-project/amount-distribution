import React from "react";
import "../styles/Loader.css";

export default function Loader({ fullScreen = true, message = "Loading..." }) {
  return (
    <div className={fullScreen ? "loader-fullscreen-container" : "loader-container"}>
      <div className="loader-content">
        <div className="loader-spinner"></div>
        <p className="loader-message">{message}</p>
      </div>
    </div>
  );
}
