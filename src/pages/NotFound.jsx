import React from "react";
import { Link } from "react-router-dom";
import "../styles/NotFound.css";

export default function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <div className="notfound-emoji">🧐</div>
        <h1 className="notfound-title">404 — Page Not Found</h1>
        <p className="notfound-description">
          The page you are looking for does not exist or has been moved to another path.
        </p>
        <Link
          to="/"
          className="notfound-btn"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
