import React from "react";
import { Link } from "react-router-dom";
import "../styles/AccessDenied.css";

export default function AccessDenied() {
  return (
    <div className="access-denied-container">
      <div className="access-denied-card">
        <div className="access-denied-icon-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="access-denied-icon"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <h2 className="access-denied-title">Access Denied</h2>
        <p className="access-denied-description">
          You do not have permission to view this page.
        </p>
        <p className="access-denied-subtext">
          This section is reserved for administrators only. If you believe this is an error, please contact your system administrator.
        </p>

        <div className="access-denied-actions">
          <Link
            to="/dashboard"
            className="access-denied-primary-btn"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
