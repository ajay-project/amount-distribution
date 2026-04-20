import "../styles/InputSection.css";

export default function InputSection({
  rawInput,
  onRawInputChange,
  pendingAmount,
  onAmountChange,
  onProcessInput,
  onAssignAmount,
  onAddMore,
  onCancelAddMore,
  onEditBatch,
  onRemoveBatch,
  onDelete,
  pendingNumbers,
  numbersWithAmounts,
  groupedByAmount,
  isLocked,
  isProcessed,
  isAddingMore,
  foldersGenerated,
}) {
  const hasAssigned = Object.keys(numbersWithAmounts).length > 0;
  const batchCount = Object.keys(groupedByAmount).length;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isProcessed) onProcessInput();
      else onAssignAmount();
    }
  };

  const handleClearInput = () => {
    onRawInputChange("");
  };

  // ===== LOCKED STATE — show assigned batches with per-batch actions =====
  if (isLocked && !isAddingMore) {
    return (
      <div className="input-section" id="input-section">
        <div className="section-header">
          <div className="section-icon-wrap">
            <span className="section-icon-emoji" aria-hidden="true">💵</span>
          </div>
          <div>
            <h3>Amount Assignment</h3>
            <p className="section-desc">
              {Object.keys(numbersWithAmounts).length} numbers assigned
              {batchCount > 1 && ` · ${batchCount} batches`}
            </p>
          </div>
        </div>

        <div className="locked-state">
          {/* Each amount batch with its own Edit/Remove */}
          {Object.entries(groupedByAmount)
            .sort((a, b) => Number(b[0]) - Number(a[0]))
            .map(([amt, nums]) => (
              <div key={amt} className="locked-group">
                <div className="locked-group-header">
                  <div className="locked-group-info">
                    <span className="locked-group-amount">₹{Number(amt).toLocaleString()}</span>
                    <span className="locked-group-count">{nums.length} numbers</span>
                  </div>
                  {!foldersGenerated && (
                    <div className="locked-group-actions">
                      <button
                        className="btn-batch-action btn-batch-edit"
                        onClick={() => onEditBatch(amt)}
                        title="Edit this batch"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-batch-action btn-batch-remove"
                        onClick={() => onRemoveBatch(amt)}
                        title="Remove this batch"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
                <div className="locked-group-numbers">
                  {nums.join(", ")}
                </div>
              </div>
            ))}

          {/* Bottom actions: Add More only */}
          <div className="locked-actions-bottom">
            {!foldersGenerated && (
              <button onClick={onAddMore} className="btn btn-add-more" id="add-more-btn">
                ➕ Add More
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== INPUT STATE — entering numbers and amount =====
  return (
    <div className="input-section" id="input-section">
      <div className="section-header">
        <div className="section-icon-wrap">
          <span className="section-icon-emoji" aria-hidden="true">💵</span>
        </div>
        <div>
          <h3>{isAddingMore ? "Add More Numbers" : "Amount Assignment"}</h3>
          <p className="section-desc">
            {isAddingMore
              ? "Add new numbers with a different amount"
              : "Enter numbers and assign amount"}
          </p>
        </div>
      </div>

      {/* Show existing assignments if adding more */}
      {isAddingMore && hasAssigned && (
        <div className="existing-assignments">
          <div className="existing-label">📋 Already assigned:</div>
          {Object.entries(groupedByAmount)
            .sort((a, b) => Number(b[0]) - Number(a[0]))
            .map(([amt, nums]) => (
              <div key={amt} className="existing-group">
                <span className="existing-amount">₹{Number(amt).toLocaleString()}</span>
                <span className="existing-nums">{nums.join(", ")}</span>
              </div>
            ))}
        </div>
      )}

      <div className="input-fields">
        {/* Box Numbers */}
        <div className="input-group">
          <label htmlFor="box-numbers">
            <span className="label-text">Box Numbers</span>
            <span className="label-hint">Hyphen, space, or comma separated</span>
          </label>
          <div className="input-with-clear">
            <textarea
              id="box-numbers"
              value={rawInput}
              onChange={(e) => onRawInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="input-textarea"
              placeholder="02-04-06-08  or  02 30 55 08 35"
              rows={2}
              disabled={isProcessed}
            />
            {rawInput && !isProcessed && (
              <button
                className="btn-clear-input"
                onClick={handleClearInput}
                title="Clear input"
                type="button"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Amount */}
        <div className="input-group">
          <label htmlFor="amount">
            <span className="label-text">Amount Per Number</span>
            <span className="label-hint">Must be a multiple of 5</span>
          </label>
          <div className="input-wrapper">
            <span className="input-prefix">₹</span>
            <input
              id="amount"
              type="number"
              min="5"
              step="5"
              value={pendingAmount}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") onAmountChange("");
                else {
                  const num = parseInt(val, 10);
                  if (!isNaN(num) && num > 0) onAmountChange(num);
                }
              }}
              onKeyDown={handleKeyDown}
              className="input-field"
              placeholder="e.g. 1000"
            />
          </div>
        </div>
      </div>

      {/* Processed Preview */}
      {isProcessed && (
        <div className="processed-preview">
          <div className="preview-label">
            ✅ Processed ({pendingNumbers.length} numbers)
          </div>
          <div className="preview-numbers">{pendingNumbers.join(", ")}</div>
        </div>
      )}

      <div className="input-actions">
        {!isProcessed ? (
          <button
            onClick={onProcessInput}
            className="btn btn-secondary"
            id="process-btn"
            disabled={!rawInput.trim()}
          >
            🧮 Process Input
          </button>
        ) : (
          <button
            onClick={onAssignAmount}
            className="btn btn-assign"
            id="assign-btn"
            disabled={!pendingAmount || pendingAmount <= 0}
          >
            ✅ Assign Amount
          </button>
        )}

        {isAddingMore && (
          <button
            onClick={onCancelAddMore}
            className="btn btn-secondary"
            id="cancel-add-btn"
          >
            ✖ Cancel
          </button>
        )}
      </div>
    </div>
  );
}
