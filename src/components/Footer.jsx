import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="app-footer" id="app-footer">
      <div className="footer-glow-line" aria-hidden="true"></div>

      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section footer-about">
            <div className="footer-section-label">
              <span className="footer-icon" aria-hidden="true">💡</span>
              About
            </div>
            <p>
              Amount Distribution Simulator v5.0 — distribute amounts across
              numbers with intelligent randomization and mix grouping.
            </p>
          </div>

          <div className="footer-section">
            <div className="footer-section-label">
              <span className="footer-icon" aria-hidden="true">🎯</span>
              Features
            </div>
            <ul>
              <li>Smart distribution algorithm</li>
              <li>Mix mode grouping</li>
              <li>Copy & re-randomize</li>
              <li>Mobile-first design</li>
            </ul>
          </div>

          <div className="footer-section">
            <div className="footer-section-label">
              <span className="footer-icon" aria-hidden="true">📧</span>
              Contact Developer
            </div>
            <p className="footer-contact">
              For development inquiries:
            </p>
            <a
              href="https://mail.google.com/mail/?view=cm&to=testprojectmail2024@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-email-link"
            >
              📩 testprojectmail2024@gmail.com
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="footer-credit">
            Contact for development{" "}
            <a
              href="https://mail.google.com/mail/?view=cm&to=testprojectmail2024@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-highlight"
            >
              📧 testprojectmail2024@gmail.com
            </a>
          </p>
          <p className="footer-version">Version 5.0 • Premium Edition</p>
        </div>
      </div>
    </footer>
  );
}
