import { useState } from "react";
import "../styles/ResultsPanel.css";

// Connectors replace () around amount: 01&30, 02#205, etc.
// First entry uses () as default
const CONNECTORS = ["()", "&", "#", "%", "*", "/", "_", "$"];

function getConnectorLabel(connector) {
  if (connector === "()") return "( )";
  return connector;
}

export default function ResultsPanel({ distributions, mixEnabled, onReRandomize, numbersWithAmounts }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [folderConns, setFolderConns] = useState({}); // { folderIndex: connectorIndex }

  const getConnector = (folderIndex) => {
    const idx = folderConns[folderIndex] || 0;
    return CONNECTORS[idx];
  };

  const cycleConnector = (folderIndex) => {
    setFolderConns((prev) => {
      const current = prev[folderIndex] || 0;
      return { ...prev, [folderIndex]: (current + 1) % CONNECTORS.length };
    });
  };

  // Format a single num+amount pair with the current connector
  const formatEntry = (num, amt, connector) => {
    if (connector === "()") {
      return `${num}(${amt})`;
    }
    return `${num}${connector}${amt}`;
  };

  // Mix mode format with connector
  const formatMix = (dist, connector) => {
    const groups = {};
    for (const [num, amt] of Object.entries(dist)) {
      if (!groups[amt]) groups[amt] = [];
      groups[amt].push(num);
    }
    return Object.entries(groups)
      .sort((a, b) => b[0] - a[0])
      .map(([amt, nums]) => {
        const sorted = nums.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
        if (connector === "()") {
          return `${sorted.join(",")}(${amt})`;
        }
        return `${sorted.join(",")}${connector}${amt}`;
      })
      .join(", ");
  };

  const getFolderText = (dist, folderIndex) => {
    const entries = Object.entries(dist).sort((a, b) =>
      a[0].localeCompare(b[0], undefined, { numeric: true })
    );
    const total = Object.values(dist).reduce((a, b) => a + b, 0);
    const connector = getConnector(folderIndex);

    let text;
    if (mixEnabled) {
      text = formatMix(dist, connector);
    } else {
      text = entries.map(([num, amt]) => formatEntry(num, amt, connector)).join(", ");
    }
    return `Folder ${folderIndex + 1}: ${text} ==== ${total}`;
  };

  const handleCopy = (folderIndex) => {
    const text = getFolderText(distributions[folderIndex], folderIndex);
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(folderIndex);
      setTimeout(() => setCopiedIndex(null), 1500);
    });
  };

  return (
    <div className="results-panel" id="results-panel">
      <div className="results-header">
        <div className="results-title-row">
          <div className="results-icon-wrap">
            <span aria-hidden="true">📋</span>
          </div>
          <div>
            <h2>Generated Distributions</h2>
            <p className="results-subtitle">
              <span className="results-count">{distributions.length}</span> folders generated
              {mixEnabled && <span className="mix-active-badge">🔀 Mix</span>}
            </p>
          </div>
        </div>
        <button
          onClick={onReRandomize}
          className="btn btn-warning-outline btn-compact btn-rerandomize"
          id="rerandomize-top-btn"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
          </svg>
          Re-Generate
        </button>
      </div>

      <div className="results-scroll">
        {distributions.map((distribution, folderIndex) => {
          const entries = Object.entries(distribution).sort((a, b) =>
            a[0].localeCompare(b[0], undefined, { numeric: true })
          );
          const folderTotal = Object.values(distribution).reduce((a, b) => a + b, 0);
          const connector = getConnector(folderIndex);

          return (
            <div
              key={folderIndex}
              className="folder-card"
              style={{ animationDelay: `${folderIndex * 0.03}s` }}
            >
              <div className="folder-card-header">
                <div className="folder-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                  </svg>
                  Folder {folderIndex + 1}
                </div>
                <div className="folder-header-right">
                  <span className="folder-total-badge">₹{folderTotal.toLocaleString()}</span>

                  {/* Connector Change Button */}
                  <button
                    className="btn-sep-change"
                    onClick={() => cycleConnector(folderIndex)}
                    title={`Change format (current: ${getConnectorLabel(connector)})`}
                  >
                    🔁
                  </button>

                  {/* Copy Button */}
                  <button
                    className={`btn-copy ${copiedIndex === folderIndex ? "copied" : ""}`}
                    onClick={() => handleCopy(folderIndex)}
                    title="Copy folder"
                  >
                    {copiedIndex === folderIndex ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="folder-content">
                {mixEnabled ? (
                  <div className="folder-mix-text">{formatMix(distribution, connector)}</div>
                ) : (
                  <div className="allocations-inline">
                    {entries.map(([num, amt], idx) => (
                      <span key={num} className="allocation-chip">
                        {connector === "()" ? (
                          <>{num}<span className="chip-amt">({amt})</span></>
                        ) : (
                          <>{num}<span className="chip-connector">{connector}</span>{amt}</>
                        )}
                        {idx < entries.length - 1 && (
                          <span className="chip-sep">,</span>
                        )}
                      </span>
                    ))}
                  </div>
                )}
                <div className="folder-total-line">==== {folderTotal}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
