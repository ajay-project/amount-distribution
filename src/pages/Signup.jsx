import React, { useState } from "react";
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
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(email, password, name);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Signup failed. Please try again with different inputs.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-logo-container">
            <span className="signup-logo-emoji">🎉</span>
            <h2 className="signup-title">Account Created</h2>
            <p className="signup-subtitle">Registration completed successfully!</p>
          </div>

          <div className="signup-success-alert">
            <p className="signup-success-heading">Your account is pending admin approval.</p>
            <p className="signup-success-text">
              An administrator needs to review and authorize your account before you can log in to the simulator.
            </p>
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
          <span className="signup-logo-emoji">📈</span>
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
              placeholder="Deepak Kumar"
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
    </div>
  );
}
