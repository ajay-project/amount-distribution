import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { isAdmin } from "../utils/roleHelpers";
import "../styles/Header.css";
import "../styles/Navbar.css";

export default function Navbar() {
  const { profile, logout } = useAuth();
  const location = useLocation();
  const [showInfo, setShowInfo] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = React.useRef(null);

  const currentPath = location.pathname;
  const isApproved = profile && profile.approved === true;

  useEffect(() => {
    if (showInfo || menuOpen) {
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
  }, [showInfo, menuOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (!event.target.closest('.mobile-toggle-btn')) {
          setMenuOpen(false);
        }
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <>
      {menuOpen && (
        <div 
          className="nav-menu-overlay" 
          onClick={() => setMenuOpen(false)}
        />
      )}

      <nav 
        className={`seamless-nav ${isApproved ? "is-approved" : ""}`}
        style={{ zIndex: menuOpen ? 1001 : 900 }}
      >
        <div className="nav-container">
          {/* Left section: Logo & App Title & optional Route Links */}
          <div className="nav-left">
            <Link to="/dashboard" className="nav-brand-link" onClick={() => setMenuOpen(false)}>
              <div className="logo-icon" aria-hidden="true">
                <span className="logo-emoji">💰</span>
                <span className="logo-pulse"></span>
              </div>
              <div className="brand-text">
                <h1 className="brand-title">Amount Distribution</h1>
                <p className="brand-subtitle" style={{ fontSize: "0.7rem", color: "var(--text-muted)", margin: 0, fontWeight: 500 }}>
                  Smart money distribution across 100 boxes
                </p>
              </div>
            </Link>

          </div>

          {/* Right section: User info, Logout */}
          <div className="nav-right">
            {/* User credentials + Logout button (visible if logged in) */}
            {isApproved && (
              <>
                <div className="user-block">
                  <span className="user-name">{profile?.name || "User"}</span>
                  <span
                    className="user-role-badge"
                    style={{
                      backgroundColor: isAdmin(profile) ? "rgba(239, 68, 68, 0.15)" : "var(--primary-100)",
                      color: isAdmin(profile) ? "var(--danger)" : "var(--primary-dark)",
                    }}
                  >
                    {profile?.role || "user"}
                  </span>
                </div>
                <button className="nav-logout-btn" onClick={logout}>
                  Log Out
                </button>
              </>
            )}
          </div>

          {/* Mobile Toggle Button (Visible only when logged in & approved) */}
          {isApproved && (
            <button
              className="mobile-toggle-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}>
                  {(profile?.name || profile?.email || "U").substring(0, 2).toUpperCase()}
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-secondary)', transition: 'transform 0.2s', transform: menuOpen ? 'rotate(180deg)' : 'none' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </button>
          )}

          {/* Mobile Dropdown Menu (Visible only when logged in & approved) */}
          {isApproved && (
            <div ref={menuRef} className={`mobile-dropdown-menu ${menuOpen ? "open" : ""}`}>
              <div className="mobile-user-info" style={{ paddingBottom: '0.85rem' }}>
                <span className="mobile-user-name" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {profile?.name || "User"}
                </span>
                {profile?.email && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', wordBreak: 'break-all', marginTop: '0.1rem' }}>
                    {profile.email}
                  </span>
                )}
                <span
                  className="mobile-user-role"
                  style={{
                    backgroundColor: isAdmin(profile) ? "rgba(239, 68, 68, 0.15)" : "var(--primary-100)",
                    color: isAdmin(profile) ? "var(--danger)" : "var(--primary-dark)",
                    marginTop: '0.5rem',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    alignSelf: 'flex-start',
                  }}
                >
                  {profile?.role || "user"}
                </span>
              </div>

              <button
                className="mobile-logout-btn"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Log Out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Info Modal Overlay */}
      {showInfo && (
        <div className="info-overlay" onClick={() => setShowInfo(false)}>
          <div className="info-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowInfo(false)} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18"/><path d="M6 6l12 12"/>
              </svg>
            </button>
            <div className="info-modal-badge"><span>📖</span> Getting Started</div>
            <h2>How to Use</h2>
            <div className="info-content">
              <div className="info-step">
                <div className="step-number">1</div>
                <div className="step-detail">
                  <h3>Enter Amount</h3>
                  <p>Input the total money you want to distribute across your selected boxes.</p>
                </div>
              </div>
              <div className="info-step">
                <div className="step-number">2</div>
                <div className="step-detail">
                  <h3>Select Boxes</h3>
                  <p>Enter box numbers (1-100) separated by commas to choose which boxes receive funds.</p>
                </div>
              </div>
              <div className="info-step">
                <div className="step-number">3</div>
                <div className="step-detail">
                  <h3>Assign Amount</h3>
                  <p>Click "Assign" to distribute the amount equally among your selected boxes.</p>
                </div>
              </div>
              <div className="info-step">
                <div className="step-number">4</div>
                <div className="step-detail">
                  <h3>Generate Distributions</h3>
                  <p>Set folder count and generate randomized distributions across unique box sets.</p>
                </div>
              </div>
              <div className="info-step">
                <div className="step-number">5</div>
                <div className="step-detail">
                  <h3>Download Results</h3>
                  <p>Export distributions as TXT or PDF for further processing or analysis.</p>
                </div>
              </div>
            </div>
            <div className="info-features-card">
              <h3>✨ Key Features</h3>
              <div className="features-grid">
                <div className="feature-chip"><span>📊</span> Interactive 10×10 grid</div>
                <div className="feature-chip"><span>⚡</span> Real-time statistics</div>
                <div className="feature-chip"><span>🎲</span> Smart randomization</div>
                <div className="feature-chip"><span>📥</span> TXT & PDF export</div>
                <div className="feature-chip"><span>📱</span> Fully responsive</div>
                <div className="feature-chip"><span>🎨</span> Modern UI design</div>
              </div>
            </div>
            <div className="info-contact-card">
              <h3>📧 Contact Developer</h3>
              <p>For development inquiries and custom solutions:</p>
              <a
                href="https://mail.google.com/mail/?view=cm&to=testprojectmail2024@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="info-email-link"
              >
                testprojectmail2024@gmail.com
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
