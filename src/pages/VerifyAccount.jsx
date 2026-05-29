import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
// sessionService is dynamically imported at each call-site (same pattern as AuthContext)
// to prevent Vite's mixed static+dynamic import warning and keep it out of the main bundle.
import "../styles/VerifyAccount.css";

/**
 * VerifyAccount — Dedicated post-login account verification gate.
 *
 * Responsibilities:
 *  1. If user is already verified (context populated from cache) → skip straight to dashboard
 *  2. Read pending userId from localStorage
 *  3. Fetch DB profile + check approved status
 *  4. Enforce active session / screen limits
 *  5. Write sim_ cache keys so refresh/back-button work instantly from here on
 *  6. Redirect to dashboard (approved) or login (unapproved/error)
 */
export default function VerifyAccount() {
  const navigate = useNavigate();
  const { setVerifiedProfile, user, profile } = useAuth();

  const [status, setStatus] = useState("verifying");
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const hasRun = useRef(false);

  // Helper function to establish session record and update cache + auth context
  const proceedWithSessionCreation = async (userId, session, authUser, profileData) => {
    try {
      const { createSession } = await import("../services/sessionService");
      const token = await createSession(userId);

      localStorage.removeItem("pending_verification_user");

      // Write sim_ cache keys BEFORE updating context + navigating
      if (session) {
        localStorage.setItem("sim_auth_session",    JSON.stringify(session));
        localStorage.setItem("sim_auth_profile",    JSON.stringify(profileData));
        localStorage.setItem("sim_verified_user",   JSON.stringify(authUser));
        localStorage.setItem("sim_auth_verified_at", Date.now().toString());
      }

      // Inject verified profile into AuthContext
      setVerifiedProfile(authUser, profileData);

      setStatus("approved");
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 800);
    } catch (err) {
      console.error("Error creating session:", err);
      localStorage.removeItem("pending_verification_user");
      await supabase.auth.signOut();
      navigate("/login", { replace: true });
    }
  };

  const handleResolveLimit = async () => {
    setStatus("verifying");
    setShowLimitModal(false);

    const { data: { session } } = await supabase.auth.getSession();
    const authUser = session?.user;
    let userId = localStorage.getItem("pending_verification_user");
    if (!userId && authUser) userId = authUser.id;

    if (!userId) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      // Terminate oldest session to make room
      const { revokeOldestSession } = await import("../services/sessionService");
      await revokeOldestSession(userId);

      // Fetch profile
      const { data: profileData } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      await proceedWithSessionCreation(userId, session, authUser, profileData);
    } catch (err) {
      console.error("Error resolving session limit:", err);
      navigate("/login", { replace: true });
    }
  };

  const handleCancelLimit = async () => {
    setShowLimitModal(false);
    localStorage.removeItem("pending_verification_user");
    try {
      await supabase.auth.signOut();
    } catch (_) {}
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const verify = async () => {
      // ── Already authenticated (refresh/back to /verify-account) ────────────
      if (user && profile) {
        navigate("/dashboard", { replace: true });
        return;
      }

      // Fetch session + user first so we can write cache atomically
      const { data: { session } } = await supabase.auth.getSession();
      const authUser = session?.user;

      let userId = localStorage.getItem("pending_verification_user");
      if (!userId && authUser) userId = authUser.id;

      if (!userId) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const { data: profileData, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (error) {
          console.error("VERIFY ERROR:", error);
          localStorage.removeItem("pending_verification_user");
          await supabase.auth.signOut();
          navigate("/login", { replace: true });
          return;
        }

        // ── APPROVED ──────────────────────────────────────────────────────────
        if (profileData?.approved === true) {
          // Enforce active session / screen limits
          const { validateSessionLimit } = await import("../services/sessionService");
          const limitStatus = await validateSessionLimit(userId);
          if (!limitStatus.allowed) {
            setStatus("limit_reached");
            setShowLimitModal(true);
            return;
          }

          await proceedWithSessionCreation(userId, session, authUser, profileData);
          return;
        }

        // ── UNAPPROVED / PENDING ──────────────────────────────────────────────
        localStorage.removeItem("pending_verification_user");
        await supabase.auth.signOut();
        setStatus("pending");
        setShowPendingModal(true);
      } catch (err) {
        console.error("VERIFY EXCEPTION:", err);
        localStorage.removeItem("pending_verification_user");
        try { await supabase.auth.signOut(); } catch (_) {}
        navigate("/login", { replace: true });
      }
    };

    verify();
  }, [navigate, setVerifiedProfile, user, profile]);

  const handleGoToLogin = () => {
    setShowPendingModal(false);
    navigate("/login", { replace: true });
  };

  return (
    <div className="verify-page">
      {/* ── Pending Approval Modal ─────────────────────────────────────────── */}
      {showPendingModal && (
        <div className="verify-modal-overlay">
          <div className="verify-modal-card">
            <div className="verify-modal-icon-wrap">
              {/* Clock SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="verify-modal-icon"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 className="verify-modal-title">Approval Pending</h3>
            <p className="verify-modal-text">
              Your account is pending admin approval.
              <br />
              Please wait until <strong>Edwin</strong> approves your access.
            </p>
            <div className="verify-modal-tip">
              💡 Your credentials are correct — you just need activation from
              our team administrator.
            </div>
            <button
              onClick={handleGoToLogin}
              className="verify-modal-btn"
            >
              Back to Login
            </button>
          </div>
        </div>
      )}

      {/* ── Maximum Device Limit Reached Modal ─────────────────────────────── */}
      {showLimitModal && (
        <div className="verify-modal-overlay">
          <div className="verify-modal-card">
            <div className="verify-modal-icon-wrap">
              {/* Alert Triangle SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="verify-modal-icon"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className="verify-modal-title">Device Limit Reached</h3>
            <p className="verify-modal-text">
              Maximum screen or device limit reached.
              <br />
              Would you like to logout from older devices to continue?
            </p>
            <div className="verify-modal-tip">
              💡 Continuing will terminate your oldest active session to make room for this new one.
            </div>
            <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
              <button
                onClick={handleCancelLimit}
                className="verify-modal-btn verify-modal-btn-cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveLimit}
                className="verify-modal-btn"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Verification Card ─────────────────────────────────────────── */}
      {!showPendingModal && (
        <div className="verify-card">
          {/* Glow ring behind spinner */}
          <div className="verify-ring-outer">
            <div className="verify-ring-inner">
              {status === "verifying" && (
                <div className="verify-spinner" />
              )}
              {status === "approved" && (
                <svg
                  viewBox="0 0 52 52"
                  className="verify-check-svg"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="26" cy="26" r="25" fill="none" stroke="var(--primary)" strokeWidth="2" />
                  <polyline
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="60"
                    strokeDashoffset="0"
                    points="14,27 23,36 38,18"
                    style={{ animation: "verify-checkGrow 0.5s ease forwards" }}
                  />
                </svg>
              )}
            </div>
          </div>

          {status === "verifying" && (
            <>
              <h2 className="verify-title">Verifying Your Account</h2>
              <p className="verify-subtitle">
                Checking your credentials and approval status…
              </p>
              <div className="verify-dot-row">
                <span className="verify-dot" style={{ animationDelay: "0s" }} />
                <span className="verify-dot" style={{ animationDelay: "0.2s" }} />
                <span className="verify-dot" style={{ animationDelay: "0.4s" }} />
              </div>
            </>
          )}

          {status === "approved" && (
            <>
              <h2 className="verify-title" style={{ color: "var(--primary)" }}>
                Access Granted
              </h2>
              <p className="verify-subtitle">Redirecting to your dashboard…</p>
            </>
          )}

          {/* Security badge */}
          <div className="verify-badge">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="verify-shield-icon"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="verify-badge-text">Secure Verification</span>
          </div>
        </div>
      )}
    </div>
  );
}
