import { useState, useRef } from "react";
import "../styles/AmountDistributionSimulator.css";
import InputSection from "./InputSection";
import ResultsPanel from "./ResultsPanel";
import GridModal from "./GridModal";
import ErrorNotification from "./ErrorNotification";
import ConfirmDialog from "./ConfirmDialog";
import { parseBoxInput } from "../utils/parseBoxInput";

// ===== DISTRIBUTION HELPERS =====

/**
 * Partition `total` into `numParts` random multiples-of-5 that sum exactly to `total`.
 * Uses random-cuts method for natural randomness + sparsity for pattern hiding.
 * @param {number} total - Must be divisible by 5
 * @param {number} numParts - Number of folders
 * @returns {number[]} Array of length numParts, each a multiple of 5, summing to total
 */
function randomPartitionMul5(total, numParts) {
  if (numParts === 1) return [total];
  if (total === 0) return Array(numParts).fill(0);

  const units = total / 5; // Work in units of 5

  if (units < numParts) {
    // Not enough units for every folder — randomly assign
    let values = Array(numParts).fill(0);
    for (let u = 0; u < units; u++) {
      const idx = Math.floor(Math.random() * numParts);
      values[idx]++;
    }
    return values.map((v) => v * 5);
  }

  // Random cuts method — generates more natural-looking distributions
  let cuts = Array.from({ length: numParts - 1 }, () => Math.random());
  cuts.sort((a, b) => a - b);

  let prev = 0;
  let rawValues = [];
  for (let i = 0; i < cuts.length; i++) {
    rawValues.push(Math.floor((cuts[i] - prev) * units));
    prev = cuts[i];
  }
  rawValues.push(Math.floor((1 - prev) * units));

  // Fix rounding — distribute remaining units randomly
  let allocated = rawValues.reduce((a, b) => a + b, 0);
  let remainder = units - allocated;
  while (remainder > 0) {
    const idx = Math.floor(Math.random() * numParts);
    rawValues[idx]++;
    remainder--;
  }

  // Random sparsity — occasionally zero-out a folder and rebalance
  // This hides patterns for numbers with different amounts
  for (let i = 0; i < numParts; i++) {
    if (rawValues[i] > 0 && Math.random() < 0.15) {
      // Zero out this folder, redistribute its units to random others
      const toRedistribute = rawValues[i];
      rawValues[i] = 0;
      for (let u = 0; u < toRedistribute; u++) {
        let target;
        do {
          target = Math.floor(Math.random() * numParts);
        } while (target === i);
        rawValues[target]++;
      }
    }
  }

  // Shuffle final order
  for (let i = rawValues.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rawValues[i], rawValues[j]] = [rawValues[j], rawValues[i]];
  }

  return rawValues.map((v) => v * 5);
}

/**
 * Group numbers by their amount for mix mode.
 * Only numbers with the SAME amount are grouped together.
 */
function createMixGroupsByAmount(numbersWithAmounts) {
  // Group numbers by amount
  const byAmount = {};
  for (const [num, amt] of Object.entries(numbersWithAmounts)) {
    if (!byAmount[amt]) byAmount[amt] = [];
    byAmount[amt].push(num);
  }

  const allGroups = [];

  for (const [amt, nums] of Object.entries(byAmount)) {
    // Shuffle numbers within this amount group
    const shuffled = [...nums];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Break into pairs/triples
    let i = 0;
    while (i < shuffled.length) {
      const remaining = shuffled.length - i;
      let size;
      if (remaining >= 4) {
        size = Math.random() < 0.6 ? 2 : 3;
      } else if (remaining >= 2) {
        size = 2;
      } else {
        size = 1;
      }
      allGroups.push({ nums: shuffled.slice(i, i + size), amount: Number(amt) });
      i += size;
    }
  }

  return allGroups;
}

// ===== MAIN COMPONENT =====

export default function AmountDistributionSimulator() {
  // === Core State ===
  // Map of number → amount: { "02": 2000, "08": 2000, "78": 1000 }
  const [numbersWithAmounts, setNumbersWithAmounts] = useState({});
  const [isLocked, setIsLocked] = useState(false);

  // Pending input (for current entry round)
  const [rawInput, setRawInput] = useState("");
  const [pendingAmount, setPendingAmount] = useState("");
  const [isProcessed, setIsProcessed] = useState(false);
  const [pendingNumbers, setPendingNumbers] = useState([]);

  // Distribution state
  const [distributions, setDistributions] = useState([]);
  const [numFolders, setNumFolders] = useState("");
  const [mixEnabled, setMixEnabled] = useState(false);

  // "Add More" mode — true when user is adding additional numbers
  const [isAddingMore, setIsAddingMore] = useState(false);

  // UI state
  const [showGridModal, setShowGridModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  // === Derived ===
  const allNumbers = Object.keys(numbersWithAmounts);
  const totalNumbers = allNumbers.length;
  const totalValue = Object.values(numbersWithAmounts).reduce((s, v) => s + v, 0);
  const uniqueAmounts = [...new Set(Object.values(numbersWithAmounts))].sort((a, b) => b - a);
  const foldersGenerated = distributions.length > 0;
  const hasAssignedNumbers = totalNumbers > 0;

  // Build boxes array for grid (100 boxes)
  const boxes = Array.from({ length: 100 }, (_, index) => {
    const boxNum = String(index + 1);
    const found = allNumbers.find((n) => {
      const nKey = n.replace(/^0+/, "") || "0";
      return nKey === boxNum;
    });
    return found ? numbersWithAmounts[found] : null;
  });
  const assignedBoxes = boxes.filter((b) => b !== null).length;

  // Group numbersWithAmounts by amount for display
  const groupedByAmount = {};
  for (const [num, amt] of Object.entries(numbersWithAmounts)) {
    if (!groupedByAmount[amt]) groupedByAmount[amt] = [];
    groupedByAmount[amt].push(num);
  }
  // Sort numbers within each group
  for (const amt of Object.keys(groupedByAmount)) {
    groupedByAmount[amt].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }

  // ===== HANDLERS =====

  const handleRawInputChange = (text) => {
    setRawInput(text);
    if (isProcessed) {
      setIsProcessed(false);
      setPendingNumbers([]);
    }
  };

  const handleAmountChange = (val) => {
    setPendingAmount(val);
  };

  const handleProcessInput = () => {
    const parsed = parseBoxInput(rawInput);
    if (parsed.length === 0) {
      setNotification({ message: "No valid numbers found in input", type: "error" });
      return;
    }

    // Check for duplicates with already-assigned numbers
    const dupes = parsed.filter((n) => numbersWithAmounts[n] !== undefined);
    if (dupes.length > 0) {
      setNotification({
        message: `Numbers already assigned: ${dupes.join(", ")}. Remove them or use Edit.`,
        type: "error",
      });
      return;
    }

    setPendingNumbers(parsed);
    setRawInput(parsed.join(", "));
    setIsProcessed(true);
  };

  const handleAssignAmount = () => {
    if (!pendingAmount || pendingAmount <= 0) {
      setNotification({ message: "Please enter a valid amount greater than 0", type: "error" });
      return;
    }
    if (pendingAmount % 5 !== 0) {
      setNotification({ message: "Amount must be a multiple of 5 (e.g. 500, 1000, 2500)", type: "error" });
      return;
    }
    if (pendingNumbers.length === 0) {
      setNotification({ message: "Process numbers first", type: "error" });
      return;
    }

    // Add to numbersWithAmounts
    const updated = { ...numbersWithAmounts };
    for (const num of pendingNumbers) {
      updated[num] = pendingAmount;
    }
    setNumbersWithAmounts(updated);
    setIsLocked(true);
    setIsAddingMore(false);

    // Clear pending state
    setRawInput("");
    setPendingAmount("");
    setIsProcessed(false);
    setPendingNumbers([]);

    // Clear old folders since data changed
    if (foldersGenerated) {
      setDistributions([]);
    }

    setNotification({
      message: `✅ Assigned ₹${pendingAmount.toLocaleString()} to ${pendingNumbers.length} numbers (${Object.keys(updated).length} total)`,
      type: "success",
    });
  };

  const handleAddMore = () => {
    setIsAddingMore(true);
    setIsLocked(false);
    setRawInput("");
    setPendingAmount("");
    setIsProcessed(false);
    setPendingNumbers([]);
  };

  const handleCancelAddMore = () => {
    setIsAddingMore(false);
    setIsLocked(true);
    setRawInput("");
    setPendingAmount("");
    setIsProcessed(false);
    setPendingNumbers([]);
  };

  // Edit a specific batch (amount group) — remove those numbers and pre-fill for re-entry
  const handleEditBatch = (batchAmount) => {
    const batchNums = Object.entries(numbersWithAmounts)
      .filter(([, amt]) => amt === Number(batchAmount))
      .map(([num]) => num);

    // Remove this batch from numbersWithAmounts
    const updated = { ...numbersWithAmounts };
    for (const num of batchNums) {
      delete updated[num];
    }
    setNumbersWithAmounts(updated);

    // Pre-fill inputs with this batch's data
    setRawInput(batchNums.join(", "));
    setPendingAmount(Number(batchAmount));
    setIsProcessed(true);
    setPendingNumbers(batchNums);

    // If no numbers left, unlock fully
    if (Object.keys(updated).length === 0) {
      setIsLocked(false);
    } else {
      // Stay locked but show add-more mode for inline editing
      setIsAddingMore(true);
    }

    // Clear old folders since data changed
    if (foldersGenerated) {
      setDistributions([]);
    }
  };

  // Remove a specific batch (all numbers with that amount)
  const handleRemoveBatch = (batchAmount) => {
    const updated = { ...numbersWithAmounts };
    for (const [num, amt] of Object.entries(numbersWithAmounts)) {
      if (amt === Number(batchAmount)) {
        delete updated[num];
      }
    }
    setNumbersWithAmounts(updated);

    // If no numbers left, unlock fully
    if (Object.keys(updated).length === 0) {
      setIsLocked(false);
      setRawInput("");
      setPendingAmount("");
    }

    // Clear old folders since data changed
    if (foldersGenerated) {
      setDistributions([]);
    }

    setNotification({
      message: `Removed ₹${Number(batchAmount).toLocaleString()} batch`,
      type: "info",
    });
  };

  const handleDelete = () => {
    setNumbersWithAmounts({});
    setRawInput("");
    setPendingAmount("");
    setPendingNumbers([]);
    setIsProcessed(false);
    setIsLocked(false);
    setIsAddingMore(false);
    setDistributions([]);
    setNumFolders("");
    setMixEnabled(false);
  };

  // ===== DISTRIBUTION ALGORITHM =====
  const generateDistribution = () => {
    if (totalNumbers === 0) {
      setNotification({ message: "No numbers assigned", type: "error" });
      return;
    }
    if (!numFolders || numFolders <= 0) {
      setNotification({ message: "Enter number of folders", type: "warning" });
      return;
    }
    if (!isLocked) {
      setNotification({ message: "Please assign amount first", type: "warning" });
      return;
    }

    const folders = Array.from({ length: numFolders }, () => ({}));

    if (mixEnabled) {
      // MIX MODE: group numbers by same amount, then distribute
      const groups = createMixGroupsByAmount(numbersWithAmounts);
      for (const { nums, amount } of groups) {
        // All numbers in group share the same partition
        const partition = randomPartitionMul5(amount, numFolders);
        for (const num of nums) {
          for (let f = 0; f < numFolders; f++) {
            if (partition[f] > 0) {
              folders[f][num] = partition[f];
            }
          }
        }
      }
    } else {
      // NORMAL MODE: each number gets independent partition
      // Shuffle number order to prevent patterns
      const shuffledEntries = Object.entries(numbersWithAmounts);
      for (let i = shuffledEntries.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledEntries[i], shuffledEntries[j]] = [shuffledEntries[j], shuffledEntries[i]];
      }

      for (const [num, numAmount] of shuffledEntries) {
        const partition = randomPartitionMul5(numAmount, numFolders);
        for (let f = 0; f < numFolders; f++) {
          if (partition[f] > 0) {
            folders[f][num] = partition[f];
          }
        }
      }
    }

    setDistributions(folders);
  };

  const handleReRandomize = () => {
    generateDistribution();
  };

  const handleReset = () => {
    setConfirmDialog({
      title: "Reset Everything",
      message: "Clear all numbers, amounts, and folders?",
      confirmText: "Reset All",
      cancelText: "Cancel",
      type: "warning",
      onConfirm: () => {
        handleDelete();
        setConfirmDialog(null);
      },
      onCancel: () => setConfirmDialog(null),
    });
  };

  // ===== DOWNLOAD =====
  const handleDownload = () => {
    let content = "=== AMOUNT DISTRIBUTION REPORT ===\n";
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += "=".repeat(50) + "\n\n";

    // List all numbers with amounts
    for (const [amt, nums] of Object.entries(groupedByAmount)) {
      content += `${nums.join(", ")} → ₹${Number(amt).toLocaleString()} each\n`;
    }
    content += `\nTotal numbers: ${totalNumbers}\n`;
    content += `Total value: ₹${totalValue.toLocaleString()}\n`;
    content += "=".repeat(50) + "\n\n";

    distributions.forEach((dist, i) => {
      const entries = Object.entries(dist).sort((a, b) =>
        a[0].localeCompare(b[0], undefined, { numeric: true })
      );
      const total = Object.values(dist).reduce((a, b) => a + b, 0);
      content += `Folder ${i + 1}: `;
      entries.forEach(([num, amt]) => {
        content += `${num}(${amt}) `;
      });
      content += `==== ${total}\n`;
    });

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `distribution-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ===== RENDER =====
  return (
    <div className="simulator-container">
      {/* Hero Header */}
      <header className="simulator-hero" id="simulator-hero">
        <div className="hero-bg-shapes" aria-hidden="true">
          <div className="hero-circle hero-circle-1"></div>
          <div className="hero-circle hero-circle-2"></div>
          <div className="hero-sparkle hero-sparkle-1">✦</div>
          <div className="hero-sparkle hero-sparkle-2">✧</div>
          <div className="hero-sparkle hero-sparkle-3">⬡</div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" aria-hidden="true"></span>
            Distribution Engine v5.0
          </div>
          <h1 className="hero-title">
            <span className="hero-emoji" aria-hidden="true">💰</span>
            Amount Distribution
          </h1>
          <p className="hero-subtitle">
            Distribute amounts across numbers and generate randomized folders
          </p>
        </div>
      </header>

      {/* View Grid Button */}
      <div className="grid-toggle-bar">
        <button
          className="btn-view-grid"
          onClick={() => setShowGridModal(true)}
          id="grid-toggle-btn"
        >
          <span className="grid-btn-icon" aria-hidden="true">📦</span>
          View Box Grid
          <span className="grid-btn-badge">{assignedBoxes}</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="simulator-grid">
        <div className="simulator-column">
          {/* ===== INPUT SECTION ===== */}
          <div className="card-wrapper">
            <div className="card-deco" aria-hidden="true">
              <span className="deco deco-a">💵</span>
              <span className="deco deco-b">✨</span>
            </div>
            <InputSection
              rawInput={rawInput}
              onRawInputChange={handleRawInputChange}
              pendingAmount={pendingAmount}
              onAmountChange={handleAmountChange}
              onProcessInput={handleProcessInput}
              onAssignAmount={handleAssignAmount}
              onAddMore={handleAddMore}
              onCancelAddMore={handleCancelAddMore}
              onEditBatch={handleEditBatch}
              onRemoveBatch={handleRemoveBatch}
              onDelete={handleDelete}
              pendingNumbers={pendingNumbers}
              numbersWithAmounts={numbersWithAmounts}
              groupedByAmount={groupedByAmount}
              isLocked={isLocked}
              isProcessed={isProcessed}
              isAddingMore={isAddingMore}
              foldersGenerated={foldersGenerated}
            />
          </div>

          {/* ===== STATS ===== */}
          <div className="card-wrapper">
            <div className="card-deco" aria-hidden="true">
              <span className="deco deco-a">📊</span>
              <span className="deco deco-b">🔢</span>
            </div>
            <div className="card" id="stats-section">
              <div className="section-header">
                <div className="section-icon-wrap">
                  <span className="section-icon-emoji" aria-hidden="true">📊</span>
                </div>
                <div>
                  <h3>Distribution Stats</h3>
                  <p className="section-desc">Current assignment overview</p>
                </div>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon" aria-hidden="true">🔢</div>
                  <div className="stat-value">{totalNumbers || "—"}</div>
                  <div className="stat-label">Total Numbers</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" aria-hidden="true">💵</div>
                  <div className="stat-value">
                    {uniqueAmounts.length > 0
                      ? uniqueAmounts.map((a) => `₹${a.toLocaleString()}`).join(", ")
                      : "—"}
                  </div>
                  <div className="stat-label">
                    {uniqueAmounts.length > 1 ? "Amounts" : "Per Number"}
                  </div>
                </div>
                <div className="stat-card stat-card-highlight">
                  <div className="stat-icon" aria-hidden="true">💰</div>
                  <div className="stat-value">
                    {totalValue ? `₹${totalValue.toLocaleString()}` : "—"}
                  </div>
                  <div className="stat-label">Total Value</div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== FOLDER GENERATION ===== */}
          <div className="card-wrapper">
            <div className="card-deco" aria-hidden="true">
              <span className="deco deco-a">📁</span>
              <span className="deco deco-b">⚙️</span>
            </div>
            <div className="card" id="folder-section">
              <div className="section-header">
                <div className="section-icon-wrap">
                  <span className="section-icon-emoji" aria-hidden="true">📁</span>
                </div>
                <div>
                  <h3>Folder Generation</h3>
                  <p className="section-desc">Generate randomized distribution folders</p>
                </div>
              </div>
              <div className="folder-controls">
                <div className="input-group">
                  <label htmlFor="numFolders">
                    <span className="label-text">Number of Folders</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-prefix">#</span>
                    <input
                      id="numFolders"
                      type="number"
                      min="1"
                      value={numFolders}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNumFolders(val === "" ? "" : Math.max(1, parseInt(val) || 1));
                      }}
                      disabled={foldersGenerated}
                      className="input-field"
                      placeholder="e.g. 10"
                    />
                  </div>
                </div>

                {/* Mix Toggle */}
                <label className={`mix-toggle ${foldersGenerated ? "disabled" : ""}`}>
                  <input
                    type="checkbox"
                    checked={mixEnabled}
                    onChange={(e) => setMixEnabled(e.target.checked)}
                    disabled={foldersGenerated}
                  />
                  <span className="mix-toggle-slider"></span>
                  <span className="mix-toggle-label">
                    🔀 Mix Mode {uniqueAmounts.length > 1 && "(same-amount groups)"}
                    {foldersGenerated && <span className="mix-locked-hint">(locked)</span>}
                  </span>
                </label>

                <div className="folder-actions">
                  <button
                    onClick={generateDistribution}
                    className="btn btn-primary btn-compact"
                    disabled={!isLocked || !numFolders || foldersGenerated}
                    id="generate-btn"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="2.5" ry="2.5" />
                      <path d="M8 12h8" />
                      <path d="M12 8v8" />
                    </svg>
                    {foldersGenerated ? "✅ Folders Generated" : "Generate Folders"}
                  </button>

                  <div className="folder-secondary-actions">
                    {foldersGenerated && (
                      <>
                        <button onClick={handleReRandomize} className="btn btn-warning-outline btn-compact" id="rerandomize-btn">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 4 23 10 17 10" />
                            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
                          </svg>
                          Change
                        </button>
                        <button onClick={handleDownload} className="btn btn-success btn-compact" id="download-btn">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          Download
                        </button>
                      </>
                    )}
                    <button onClick={handleReset} className="btn btn-danger-outline btn-compact" id="reset-btn">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="1 4 1 10 7 10" />
                        <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                      </svg>
                      Reset All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Modal */}
      <GridModal boxes={boxes} isOpen={showGridModal} onClose={() => setShowGridModal(false)} />

      {/* Notification */}
      {notification && (
        <ErrorNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          isOpen={true}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          type={confirmDialog.type}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}

      {/* Results */}
      {foldersGenerated && (
        <ResultsPanel
          distributions={distributions}
          mixEnabled={mixEnabled}
          onReRandomize={handleReRandomize}
          numbersWithAmounts={numbersWithAmounts}
        />
      )}
    </div>
  );
}
