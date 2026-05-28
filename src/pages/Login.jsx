import React, { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/Login.css";

export default function Login() {
  const { login, user, profile } = useAuth();
  const navigate = useNavigate();

  // ── Synchronous redirect — runs during render, zero flash ─────────────────
  // profile is pre-populated from localStorage by AuthContext before first render.
  if (user && profile) {
    return <Navigate to="/dashboard" replace />;
  }

  // Form states
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(() => {
    const msg = localStorage.getItem("login_error_message");
    if (msg) {
      localStorage.removeItem("login_error_message");
      return msg;
    }
    return "";
  });

  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/verify-account", { replace: true });
    } catch (err) {
      console.error("Login error:", err);

      if (
        err.message?.includes("Invalid login credentials") ||
        err.message?.includes("invalid_credentials") ||
        err.message?.includes("invalid email or password")
      ) {
        setError("Invalid email or password. Please check your credentials and try again.");
      } else {
        setError(err.message || "Invalid email or password. Please check your credentials and try again.");
      }

      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Verification Overlay when processing login */}
      {loading && (
        <div className="login-loading-overlay">
          <div className="login-loading-box">
            <div className="login-overlay-spinner"></div>
            <p className="login-overlay-text">Verifying User Details...</p>
            <p className="login-overlay-subtext">Checking credentials and approval status</p>
          </div>
        </div>
      )}

      <div className="login-card">
        <div className="login-logo-container">
          <span className="login-logo-emoji">💰</span>
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to access your distribution dashboard</p>
        </div>

        {error && <div className="login-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <label htmlFor="email" className="login-label">
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
              className="login-input"
            />
          </div>

          <div className="login-input-group">
            <label htmlFor="password" className="login-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="login-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-submit-btn"
          >
            {loading ? (
              <span className="login-loading-wrapper">
                <span className="login-inline-spinner"></span>
                Verifying User Details...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="login-footer-text">
            Don't have an account?{" "}
            <Link to="/signup" className="login-footer-link">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
