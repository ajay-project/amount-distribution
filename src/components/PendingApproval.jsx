import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "../styles/PendingApproval.css";

export default function PendingApproval() {
  const { user, profile, logout, checkApprovalStatus } = useAuth();
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");

  const handleCheckStatus = async () => {
    setChecking(true);
    setMessage("");
    try {
      const isApprovedNow = await checkApprovalStatus();
      if (isApprovedNow) {
        setMessage("Congratulations! Your account has been approved. Redirecting...");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setMessage("Your account is still pending approval. Please contact your administrator.");
      }
    } catch (err) {
      setMessage("Failed to verify status. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="pending-container">
      <div className="pending-card">
        <div className="pending-icon-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pending-icon"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <h2 className="pending-title">Pending Approval</h2>
        <p className="pending-description">
          Hi <strong>{profile?.name || user?.email}</strong>, your account was successfully created!
        </p>
        <p className="pending-subtext">
          Before accessing the Amount Distribution Simulator, an administrator must approve your account.
        </p>

        {message && (
          <div
            className={`pending-message-box ${
              message.includes("approved") ? "approved" : "pending"
            }`}
          >
            {message}
          </div>
        )}

        <div className="pending-actions">
          <button
            onClick={handleCheckStatus}
            disabled={checking}
            className="pending-primary-btn"
          >
            {checking ? "Checking..." : "Refresh Status"}
          </button>
          <button
            onClick={logout}
            className="pending-secondary-btn"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
