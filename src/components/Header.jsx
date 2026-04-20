import { useState, useEffect, useRef } from "react";
import "../styles/Header.css";

export default function Header() {
  const [showInfo, setShowInfo] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (showInfo) {
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
  }, [showInfo]);

  return (
    <>
      <header className={`app-header ${hidden ? "header-hidden" : ""}`} id="app-header">
        <div className="header-container">
          <div className="header-brand">
            <div className="logo-icon" aria-hidden="true">
              <span className="logo-emoji">💰</span>
              <span className="logo-pulse"></span>
            </div>
            <div className="brand-text">
              <h1 className="brand-title">Amount Distribution Simulator</h1>
              <p className="brand-subtitle">
                Smart money distribution across 100 boxes
              </p>
            </div>
          </div>

          <div className="header-actions">
            <a
              href="https://mail.google.com/mail/?view=cm&to=testprojectmail2024@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-icon contact-btn"
              title="Contact Developer"
              aria-label="Contact Developer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
            </a>
            <button
              className="btn-icon info-btn"
              onClick={() => setShowInfo(!showInfo)}
              title="How to use"
              id="info-button"
              aria-label="About this tool"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

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
