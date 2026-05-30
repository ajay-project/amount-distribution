import React, { useState, useEffect } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/Signup.css";

export default function Signup() {
  const { signup, user, profile } = useAuth();
  const navigate = useNavigate();

  // Synchronous redirect — if already logged in, no flash of signup page
  if (user && profile) {
    return <Navigate to="/dashboard" replace />;
  }

  // Inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [redirectType, setRedirectType] = useState(""); // 'scenario_a' | 'scenario_b' | 'scenario_c'
  const [countdown, setCountdown] = useState(5);
  const [showCapacityModal, setShowCapacityModal] = useState(false);

  useEffect(() => {
    let t;
    if (redirecting && countdown > 0) {
      t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (redirecting && countdown === 0) {
      navigate("/login");
    }
    return () => clearTimeout(t);
  }, [redirecting, countdown, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(email, password, name);
      // Scenario C: Clear inputs and redirect
      setName("");
      setEmail("");
      setPassword("");
      setRedirectType("scenario_c");
      setCountdown(5);
      setRedirecting(true);
    } catch (err) {
      console.error(err);
      const msg = err.message || "";
      if (msg === "CAPACITY_FULL") {
        setShowCapacityModal(true);
      } else if (msg.includes("already registered. Please login")) {
        // Scenario A: Clear inputs and redirect
        setName("");
        setEmail("");
        setPassword("");
        setRedirectType("scenario_a");
        setCountdown(5);
        setRedirecting(true);
      } else if (msg.includes("wait for admin approval")) {
        // Scenario B: Clear inputs and redirect
        setName("");
        setEmail("");
        setPassword("");
        setRedirectType("scenario_b");
        setCountdown(5);
        setRedirecting(true);
      } else {
        setError(msg || "Signup failed. Please try again with different inputs.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (redirecting) {
    let title = "";
    let alertMessage = "";
    let detailMessage = "";

    if (redirectType === "scenario_a") {
      title = "Account Registered";
      alertMessage = "This email is already registered. Please login.";
    } else if (redirectType === "scenario_b") {
      title = "Pending Approval";
      alertMessage = "You have already registered. Please wait for admin approval.";
    } else if (redirectType === "scenario_c") {
      title = "Registration successful";
      alertMessage = "Awaiting administrator approval.";
      detailMessage = "Your registration has been completed and your administrator will review your account.";
    }

    return (
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-logo-container">
            <h2 className="signup-title">{title}</h2>
            {detailMessage ? (
              <p className="signup-subtitle">{alertMessage}</p>
            ) : null}
          </div>

          <div className="signup-success-alert" style={{ marginBottom: "1.5rem" }}>
            <p className="signup-success-text" style={{ textAlign: "center", lineHeight: "1.6", fontWeight: "500", color: "var(--text-primary)" }}>
              {detailMessage || alertMessage}
            </p>
          </div>

          {/* Countdown bar */}
          <div style={{
            background: 'var(--bg-input, rgba(0,0,0,0.02))',
            borderRadius: 'var(--radius-md)',
            padding: '0.9rem 1rem',
            border: '1px solid var(--border)',
            marginBottom: '1.75rem'
          }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.6rem', textAlign: 'center' }}>
              Redirecting to login in <strong style={{ color: 'var(--primary, #f97316)', fontFamily: 'monospace' }}>{countdown}s</strong>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                background: 'var(--primary, #f97316)',
                width: `${(countdown / 5) * 100}%`,
                transition: 'width 1s linear',
              }} />
            </div>
          </div>

          <Link
            to="/login"
            className="signup-back-btn"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-logo-container">
          <h2 className="signup-title">Create Account</h2>
          <p className="signup-subtitle">Register to simulate custom distribution models</p>
        </div>

        {error && <div className="signup-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="signup-input-group">
            <label htmlFor="name" className="signup-label">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              className="signup-input"
            />
          </div>

          <div className="signup-input-group">
            <label htmlFor="email" className="signup-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="signup-input"
            />
          </div>

          <div className="signup-input-group">
            <label htmlFor="password" className="signup-label">
              Password (min. 6 characters)
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
              className="signup-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="signup-submit-btn"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <div className="signup-footer">
          <p className="signup-footer-text">
            Already have an account?{" "}
            <Link to="/login" className="signup-footer-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {showCapacityModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}>
          <div style={{
            background: "var(--bg-card, #ffffff)",
            border: "1px solid var(--border, rgba(0, 0, 0, 0.1))",
            borderRadius: "var(--radius-xl, 12px)",
            padding: "2.5rem",
            maxWidth: "480px",
            width: "90%",
            boxShadow: "var(--shadow-2xl, 0 25px 50px -12px rgba(0, 0, 0, 0.25))",
            textAlign: "center",
            position: "relative",
          }}>
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.5rem",
              color: "#ef4444",
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3 style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "var(--text-primary)",
              marginBottom: "1.25rem",
              marginTop: "0",
            }}>
              Registration Unavailable
            </h3>
            <p style={{
              fontSize: "0.95rem",
              color: "var(--text-secondary)",
              lineHeight: "1.6",
              marginBottom: "1rem",
              marginTop: "0",
            }}>
              The platform has reached its maximum licensed user capacity.
            </p>
            <p style={{
              fontSize: "0.95rem",
              color: "var(--text-secondary)",
              lineHeight: "1.6",
              marginBottom: "1rem",
              marginTop: "0",
            }}>
              New registrations are currently unavailable.
            </p>
            <p style={{
              fontSize: "0.95rem",
              color: "var(--text-secondary)",
              lineHeight: "1.6",
              marginBottom: "2rem",
              marginTop: "0",
            }}>
              Please contact the platform administrator for additional capacity.
            </p>
            <button
              onClick={() => setShowCapacityModal(false)}
              style={{
                width: "100%",
                padding: "0.85rem",
                borderRadius: "var(--radius-md, 8px)",
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                color: "#ffffff",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(249, 115, 22, 0.3)",
                transition: "all 0.2s",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
